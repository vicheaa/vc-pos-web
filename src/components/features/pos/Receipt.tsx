import React from 'react';
import type { CartItem } from '@/types';

interface ReceiptProps {
  cartItems: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
}

export const Receipt = React.forwardRef<HTMLDivElement, ReceiptProps>(
  ({ cartItems, subtotal, tax, total }, ref) => {
    return (
      <div ref={ref} className="hidden print:block print:fixed print:inset-0 print:bg-white print:z-[9999] print:p-8 text-black">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-2xl font-bold">VC POS</h1>
          <p className="text-sm text-gray-500">Phnom Penh, Cambodia</p>
          <p className="text-sm text-gray-500">Tel: +855 12 345 678</p>
          <p className="text-sm text-gray-500">{new Date().toLocaleString()}</p>
        </div>

        <div className="border-b-2 border-dashed border-gray-300 my-4" />

        <div className="space-y-2">
          {cartItems.map((item) => (
            <div key={item.product.id} className="flex justify-between text-sm">
              <div className="flex-1">
                <span className="font-medium">{item.product.name}</span>
                <div className="text-xs text-gray-500">
                  {item.quantity} x ${item.product.price.toFixed(2)}
                </div>
              </div>
              <span className="font-medium">
                ${(item.quantity * item.product.price).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-b-2 border-dashed border-gray-300 my-4" />

        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (0%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-2">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="border-b-2 border-dashed border-gray-300 my-4" />

        <div className="text-center text-sm text-gray-500 mt-6">
          <p>Thank you for your purchase!</p>
          <p>Please come again.</p>
        </div>
      </div>
    );
  }
);

Receipt.displayName = 'Receipt';
