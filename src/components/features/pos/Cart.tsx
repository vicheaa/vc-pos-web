'use client';

import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Plus, Minus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { imageUrl } from "@/lib/image-services";
import { OrderReviewModal } from './OrderReviewModal';

function QuantityInput({
  value,
  onUpdate,
}: {
  value: number;
  onUpdate: (val: number) => void;
}) {
  const [localValue, setLocalValue] = useState(value.toString());

  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  const handleBlur = () => {
    const newValue = parseInt(localValue, 10);
    if (!isNaN(newValue) && newValue > 0) {
      onUpdate(newValue);
    } else {
      setLocalValue(value.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <Input
      className="h-6 w-10 px-0 text-center text-xs focus-visible:ring-1 focus-visible:ring-offset-0 border-none"
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    />
  );
}


export function Cart() {
  const { cartItems, updateQuantity, removeFromCart, cartSubtotal, cartTotal, totalItems, clearCart, submitOrder } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const handleCharge = () => {
    setIsReviewOpen(true);
  };

  const handleConfirmPayment = async () => {
    try {
      setIsSubmitting(true);
      await submitOrder();
      setIsReviewOpen(false);
    } catch (error) {
      // Error is handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full flex-col backdrop-blur-sm bg-background/50">
      <div className="flex items-center justify-between p-4 pb-2">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Current Order</h2>
        {cartItems.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="h-8 px-2 text-muted-foreground hover:bg-background hover:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 px-4">
        {cartItems.length === 0 ? (
          <div className="flex h-[50vh] flex-col items-center justify-center text-center text-muted-foreground">
            <div className="mb-4 rounded-full bg-muted/50 p-4">
              <Plus className="h-8 w-8 opacity-50" />
            </div>
            <p className="font-medium">No items yet</p>
            <p className="text-sm">Select products to add to order</p>
          </div>
        ) : (
          <div className="space-y-1 py-4">
            {cartItems.map((item) => (
              <div
                key={item.product.id}
                className="group flex items-center gap-3 rounded-lg border border-transparent bg-card/50 p-2 transition-colors hover:border-border hover:bg-card"
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                  <Image
                    src={`${imageUrl}/${item.product.thumbnail}`}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="30px"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-sm font-medium leading-none">
                      {item.product.name}
                    </p>
                    <p className="text-sm font-semibold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-end justify-between">
                    <p className="text-xs text-muted-foreground">
                      ${item.product.price.toFixed(2)} / {item.product.uom}
                    </p>

                    <div className="flex items-center gap-1 rounded-md bg-muted/50 p-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-sm hover:bg-background hover:text-accent"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>

                      <QuantityInput
                        value={item.quantity}
                        onUpdate={(val) => updateQuantity(item.product.id, val)}
                      />

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-sm hover:bg-background hover:text-accent"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="mt-auto border-t bg-background/50 p-4 backdrop-blur-sm">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${cartSubtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax (0%)</span>
            <span>$0.00</span>
          </div>
          <div className="flex items-center justify-between border-t pt-2">
            <span className="text-base font-semibold">Total</span>
            <span className="text-xl font-bold tracking-tight">
              ${cartTotal.toFixed(2)}
            </span>
          </div>
        </div>

        <Button
          className="mt-4 w-full bg-accent rounded-lg font-semibold hover:bg-accent/90"
          size="lg"
          disabled={cartItems.length === 0 || isSubmitting}
          onClick={handleCharge}
        >
          Charge ${cartTotal.toFixed(2)}
        </Button>
      </div>

      <OrderReviewModal
        open={isReviewOpen}
        onOpenChange={setIsReviewOpen}
        cartItems={cartItems}
        subtotal={cartSubtotal}
        tax={0}
        total={cartTotal}
        onConfirm={handleConfirmPayment}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
