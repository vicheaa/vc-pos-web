'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { Plus, Minus, X, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AIRecommendations } from './AIRecommendations';

export function Cart() {
  const { cartItems, updateQuantity, removeFromCart, cartSubtotal, cartTotal, totalItems, clearCart } = useCart();

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
            <CardTitle>Cart ({totalItems})</CardTitle>
            {cartItems.length > 0 && (
                <Button variant="ghost" size="icon" onClick={clearCart} className="text-muted-foreground">
                    <Trash2 className="h-4 w-4" />
                </Button>
            )}
        </div>
      </CardHeader>
      <ScrollArea className="flex-1">
        <CardContent>
          {cartItems.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center text-center">
                <p className="text-muted-foreground">Your cart is empty.</p>
                <p className="text-sm text-muted-foreground">Select products to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex items-start gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                      data-ai-hint={item.product.imageHint}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)}</p>
                    <div className="mt-2 flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                            <Minus className="h-3 w-3" />
                        </Button>
                        <span>{item.quantity}</span>
                         <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => removeFromCart(item.product.id)}>
                        <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </ScrollArea>
      
      {cartItems.length > 0 && <AIRecommendations />}
      
      <CardFooter className="mt-auto flex-col gap-2 border-t p-4">
        <div className="flex w-full justify-between text-sm">
          <span>Subtotal</span>
          <span>${cartSubtotal.toFixed(2)}</span>
        </div>
        <div className="flex w-full justify-between text-sm text-green-600">
          <span>Discounts</span>
          <span>-$0.00</span>
        </div>
        <Separator />
        <div className="flex w-full justify-between font-semibold">
          <span>Total</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
        <Button className="mt-4 w-full bg-accent hover:bg-accent/90" size="lg" disabled={cartItems.length === 0}>
          Checkout
        </Button>
      </CardFooter>
    </Card>
  );
}
