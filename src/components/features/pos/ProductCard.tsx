"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { MouseEvent } from "react";
import { imageUrl } from "@/lib/image-services";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Card className="group flex h-full flex-col overflow-hidden border-muted-foreground/20 transition-all hover:shadow-lg">
      <div className="relative aspect-square w-full overflow-hidden bg-muted/50">
        <Image
          src={`${imageUrl}/${product.thumbnail}`}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <CardContent className="flex flex-col gap-1 p-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {product.category}
        </p>
        <h3 className="line-clamp-2 text-base font-semibold leading-tight tracking-tight">
          {product.name}
        </h3>
      </CardContent>

      <CardFooter className="mt-auto flex items-center justify-between p-4 pt-0">
        <p className="text-xl font-bold text-accent">
          ${product.price.toFixed(2)}
        </p>
        <Button
          size="icon"
          className="h-9 w-9 rounded-full shrink-0 transition-transform active:scale-95 bg-accent hover:bg-accent/90"
          onClick={handleAddToCart}
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingCart className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
