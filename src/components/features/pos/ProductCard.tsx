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

  const handleAddToCart = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Card
      onClick={handleAddToCart}
      className="group flex h-full flex-col overflow-hidden transition-all hover:shadow-md border-none"
    >
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
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          {product.category}
        </p>
        <h3 className="line-clamp-2      leading-tight">
          {product.name}
        </h3>
      </CardContent>

      <CardFooter className="mt-auto flex items-center justify-between p-4 pt-0">
        <p className="text-lg text-foreground">
          ${product.price.toFixed(2)}
        </p>
        <Button
          size="icon"
          className="group h-9 w-9 rounded-full shrink-0 transition-transform active:scale-95 bg-background hover:bg-background/90"
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingCart className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-accent" />
        </Button>
      </CardFooter>
    </Card>
  );
}
