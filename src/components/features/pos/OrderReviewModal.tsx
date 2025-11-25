import React, { useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CartItem } from '@/types';
import { Receipt } from './Receipt';
import { Printer, Check } from 'lucide-react';
import Image from 'next/image';
import { imageUrl } from '@/lib/image-services';

interface OrderReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartItems: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function OrderReviewModal({
  open,
  onOpenChange,
  cartItems,
  subtotal,
  tax,
  total,
  onConfirm,
  isSubmitting,
}: OrderReviewModalProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Review Order</DialogTitle>
            <DialogDescription>
              Please review the order details before confirming payment.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4">
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <Image
                      src={`${imageUrl}/${item.product.thumbnail}`}
                      alt={item.product.name}
                      width={50}
                      height={50}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{item.product.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.quantity} x ${item.product.price.toFixed(2)}
                      </span>
                    </div>
                    <span className="font-medium">
                      ${(item.quantity * item.product.price).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (0%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" />
              Print Receipt
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isSubmitting}
              className="gap-2 bg-accent hover:bg-accent/90"
            >
              {isSubmitting ? (
                "Processing..."
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Confirm Payment
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Receipt
        cartItems={cartItems}
        subtotal={subtotal}
        tax={tax}
        total={total}
      />
    </>
  );
}
