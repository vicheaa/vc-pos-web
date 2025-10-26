'use client';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import type { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  return (
    <Card className="flex cursor-pointer flex-col overflow-hidden transition-all hover:shadow-lg active:scale-95" onClick={() => addToCart(product)}>
      <div className="relative aspect-square w-full">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover"
          data-ai-hint={product.imageHint}
        />
      </div>
      <CardContent className="p-3">
        <h3 className="truncate font-semibold">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{product.category}</p>
      </CardContent>
      <CardFooter className="mt-auto p-3 pt-0">
        <p className="w-full text-lg font-bold">${product.price.toFixed(2)}</p>
      </CardFooter>
    </Card>
  );
}
