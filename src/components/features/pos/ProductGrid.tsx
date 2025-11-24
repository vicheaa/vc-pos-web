'use client';
import { ProductCard } from './ProductCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Product } from '@/types';

export interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  error?: any;
}

export function ProductGrid({ products, isLoading, error }: ProductGridProps) {
  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-destructive">
        <p>Failed to load products. Please try again.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 p-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] w-full animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
        <p>No products found.</p>
      </div>
    );
  }

  return (  
    <ScrollArea className="h-full">
      <div className="grid grid-cols-2 gap-4 p-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </ScrollArea>
  );
}
