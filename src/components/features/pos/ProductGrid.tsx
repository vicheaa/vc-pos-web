'use client';
import { products } from '@/lib/data';
import { ProductCard } from './ProductCard';
import { ScrollArea } from '@/components/ui/scroll-area';

export function ProductGrid() {
  return (
    <ScrollArea className="h-full">
      <div className="grid grid-cols-2 gap-4 p-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </ScrollArea>
  );
}
