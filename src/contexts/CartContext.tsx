"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { Product, CartItem } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { orderApi } from "@/lib/api-services";

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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
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
  }, []);

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
      console.error("Submit order error:", error);
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
