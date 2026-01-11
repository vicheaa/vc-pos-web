"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { Product, CartItem, ParkedOrder } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { orderApi } from "@/lib/api-services";
import { saveOfflineOrder, getOfflineOrders, deleteOfflineOrder, saveParkedOrder, getParkedOrders, deleteParkedOrder } from "@/lib/db";


interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  submitOrder: () => Promise<void>;
  cartTotal: number;
  cartSubtotal: number;
  totalItems: number;
  // Park Order Functions
  parkedOrders: ParkedOrder[];
  parkOrder: (note?: string) => Promise<void>;
  restoreParkedOrder: (orderId: string) => Promise<void>;
  discardParkedOrder: (orderId: string) => Promise<void>;
  loadParkedOrders: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [parkedOrders, setParkedOrders] = useState<ParkedOrder[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("pos-cart");
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      setCartItems([]);
    }

    // Load parked orders on mount
    loadParkedOrders();

    // Sync offline orders when coming back online
    const handleOnline = async () => {
      toast({
        title: "Back online",
        description: "Syncing offline orders...",
      });
      await syncOfflineOrders();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  const loadParkedOrders = async () => {
    try {
      const orders = await getParkedOrders();
      setParkedOrders(orders.sort((a, b) => b.createdAt - a.createdAt));
    } catch (error) {
      console.error("Failed to load parked orders:", error);
    }
  };

  const parkOrder = async (note?: string) => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add items to cart before parking",
        variant: "destructive",
      });
      return;
    }

    try {
      await saveParkedOrder(cartItems, note);
      clearCart();
      await loadParkedOrders();
      toast({
        title: "Order parked",
        description: note ? `Parked: ${note}` : "Order has been parked for later",
      });
    } catch (error) {
      console.error("Failed to park order:", error);
      toast({
        title: "Error",
        description: "Failed to park order",
        variant: "destructive",
      });
    }
  };

  const restoreParkedOrder = async (orderId: string) => {
    const parkedOrder = parkedOrders.find((o) => o.id === orderId);
    if (!parkedOrder) {
      toast({
        title: "Error",
        description: "Parked order not found",
        variant: "destructive",
      });
      return;
    }

    // If cart has items, ask for confirmation handled in UI
    setCartItems(parkedOrder.items);
    persistCart(parkedOrder.items);
    await deleteParkedOrder(orderId);
    await loadParkedOrders();
    toast({
      title: "Order restored",
      description: "Parked order has been restored to cart",
    });
  };

  const discardParkedOrder = async (orderId: string) => {
    try {
      await deleteParkedOrder(orderId);
      await loadParkedOrders();
      toast({
        title: "Order discarded",
        description: "Parked order has been removed",
      });
    } catch (error) {
      console.error("Failed to discard parked order:", error);
      toast({
        title: "Error",
        description: "Failed to discard parked order",
        variant: "destructive",
      });
    }
  };

  const syncOfflineOrders = async () => {
    try {
      const offlineOrders = await getOfflineOrders();
      if (offlineOrders.length === 0) return;

      let syncedCount = 0;
      for (const order of offlineOrders) {
        try {
          const payload = { items: order.items };
          const response = await orderApi.createOrder(payload);
          if (response.success) {
            await deleteOfflineOrder(order.id);
            syncedCount++;
          }
        } catch (error) {
          console.error("Failed to sync order", order.id, error);
        }
      }

      if (syncedCount > 0) {
        toast({
          title: "Sync Complete",
          description: `Successfully synced ${syncedCount} offline orders.`,
        });
      }
    } catch (error) {
      console.error("Error syncing offline orders:", error);
    }
  };


  const persistCart = useCallback((items: CartItem[]) => {
    localStorage.setItem("pos-cart", JSON.stringify(items));
  }, []);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product.id === product.id
      );
      let newItems;
      if (existingItem) {
        newItems = prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...prevItems, { product, quantity }];
      }
      persistCart(newItems);
      return newItems;
    });
    toast({
      id: "add-to-cart",
      title: `${product.name} added to cart`,
      duration: 2000,
    });
  };

  const submitOrder = async () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        variant: "destructive",
      });
      return;
    }

    try {
      if (!navigator.onLine) {
        throw new Error("Offline");
      }

      const payload = {
        items: cartItems.map((item) => ({
          product_code: item.product.id,
          quantity: item.quantity,
        })),
      };

      const response = await orderApi.createOrder(payload);

      if (response.success) {
        clearCart();
        toast({
          title: "Order submitted successfully",
          description: response.message,
        });
      } else {
        throw new Error(response.message || "Failed to submit order");
      }
    } catch (error: any) {
      if (error.message !== "Offline") {
        console.error("Submit order error:", error);
      }

      
      // If offline or network error, save to local DB
      if (!navigator.onLine || error.message === "Offline" || error.message === "Failed to fetch") {
        try {
          await saveOfflineOrder(cartItems);
          clearCart();
          toast({
            title: "Order saved offline",
            description: "Your order has been saved locally and will be synced when you are back online.",
            duration: 5000,
          });
          return; // Successfully handled offline
        } catch (dbError) {
          console.error("Failed to save offline order:", dbError);
          toast({
            title: "Error saving offline order",
            description: "Could not save order locally.",
            variant: "destructive",
          });
          throw dbError;
        }
      }

      toast({
        title: "Error submitting order",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
      throw error;
    }

  };

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) => {
      const newItems = prevItems.filter(
        (item) => item.product.id !== productId
      );
      persistCart(newItems);
      return newItems;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) => {
      const newItems = prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      persistCart(newItems);
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("pos-cart");
  };

  const cartSubtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const cartTotal = cartSubtotal; // For now, total is same as subtotal. Promotions will change this.
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        submitOrder,
        cartTotal,
        cartSubtotal,
        totalItems,
        parkedOrders,
        parkOrder,
        restoreParkedOrder,
        discardParkedOrder,
        loadParkedOrders,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
