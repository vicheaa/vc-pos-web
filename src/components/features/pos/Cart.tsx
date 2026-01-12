'use client';

import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Plus, Minus, Trash2, PauseCircle, PlayCircle, X, Clock } from 'lucide-react';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { imageUrl } from "@/lib/image-services";
import { OrderReviewModal } from './OrderReviewModal';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

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
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    cartSubtotal, 
    cartTotal, 
    totalItems, 
    clearCart, 
    submitOrder,
    parkedOrders,
    parkOrder,
    restoreParkedOrder,
    discardParkedOrder,
  } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isParkedSheetOpen, setIsParkedSheetOpen] = useState(false);
  const [parkNote, setParkNote] = useState('');
  const [showParkDialog, setShowParkDialog] = useState(false);
  const [restoreConfirmId, setRestoreConfirmId] = useState<string | null>(null);
  const [discardConfirmId, setDiscardConfirmId] = useState<string | null>(null);

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

  const handleParkOrder = async () => {
    await parkOrder(parkNote || undefined);
    setParkNote('');
    setShowParkDialog(false);
  };

  const handleRestoreOrder = async (orderId: string) => {
    if (cartItems.length > 0) {
      setRestoreConfirmId(orderId);
    } else {
      await restoreParkedOrder(orderId);
      setIsParkedSheetOpen(false);
    }
  };

  const confirmRestore = async () => {
    if (restoreConfirmId) {
      await restoreParkedOrder(restoreConfirmId);
      setRestoreConfirmId(null);
      setIsParkedSheetOpen(false);
    }
  };

  const handleDiscardOrder = (orderId: string) => {
    setDiscardConfirmId(orderId);
  };

  const confirmDiscard = async () => {
    if (discardConfirmId) {
      await discardParkedOrder(discardConfirmId);
      setDiscardConfirmId(null);
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <div className="flex items-center justify-between p-4 pb-2">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Current Order</h2>
        <div className="flex items-center gap-2">
          {/* Parked Orders Button */}
          <Sheet open={isParkedSheetOpen} onOpenChange={setIsParkedSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 relative"
              >
                <PauseCircle className="mr-1 h-4 w-4" />
                Parked
                {parkedOrders.length > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -right-2 -top-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {parkedOrders.length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[350px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Parked Orders</SheetTitle>
                <SheetDescription>
                  Orders saved for later. Click to restore.
                </SheetDescription>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-10rem)] mt-4">
                {parkedOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <PauseCircle className="h-12 w-12 mb-4 opacity-50" />
                    <p>No parked orders</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {parkedOrders.map((order) => {
                      const orderTotal = order.items.reduce(
                        (sum, item) => sum + item.product.price * item.quantity,
                        0
                      );
                      const itemCount = order.items.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                      );
                      return (
                        <div
                          key={order.id}
                          className="rounded-lg border bg-card p-3 space-y-2"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
                              </div>
                              {order.note && (
                                <p className="text-sm font-medium mt-1">{order.note}</p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground hover:text-destructive"
                              onClick={() => handleDiscardOrder(order.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="text-sm">
                            <span className="text-muted-foreground">{itemCount} items</span>
                            <span className="mx-2">•</span>
                            <span className="font-semibold">${orderTotal.toFixed(2)}</span>
                          </div>

                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {order.items.map((item) => item.product.name).join(', ')}
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => handleRestoreOrder(order.id)}
                          >
                            <PlayCircle className="mr-2 h-4 w-4" />
                            Restore Order
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </SheetContent>
          </Sheet>

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
      </div>

      <ScrollArea className="flex-1 min-h-0 px-4">
        {cartItems.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground py-12">
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
                  <img
                  src={`${imageUrl}/${item.product.thumbnail}`}
                  alt={item.product.name}
                  className="h-full w-full object-cover"
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

      <div className="shrink-0 border-t bg-background p-4">
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

        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            className=" hover:bg-primary"
            disabled={cartItems.length === 0}
            onClick={() => setShowParkDialog(true)}
          >
            <PauseCircle className=" h-4" />
          </Button>
          <Button
            className="flex-1 rounded-md bg-accent font-semibold hover:bg-accent/90"
            size="lg"
            disabled={cartItems.length === 0 || isSubmitting}
            onClick={handleCharge}
          >
            Charge ${cartTotal.toFixed(2)}
          </Button>
        </div>
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

      {/* Park Order Dialog */}
      <AlertDialog open={showParkDialog} onOpenChange={setShowParkDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Park this order?</AlertDialogTitle>
            <AlertDialogDescription>
              Save this order for later. You can add an optional note to help identify it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            placeholder="Add a note (optional)"
            value={parkNote}
            onChange={(e) => setParkNote(e.target.value)}
            className="mt-2"
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setParkNote('')}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleParkOrder}>Park Order</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Restore Confirmation Dialog */}
      <AlertDialog open={!!restoreConfirmId} onOpenChange={() => setRestoreConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Replace current cart?</AlertDialogTitle>
            <AlertDialogDescription>
              You have items in your cart. Restoring this parked order will replace them.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRestore}>Replace Cart</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Discard Confirmation Dialog */}
      <AlertDialog open={!!discardConfirmId} onOpenChange={() => setDiscardConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard parked order?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The parked order will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDiscard}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
