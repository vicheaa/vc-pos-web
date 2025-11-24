'use client';
import { ProductCard } from './ProductCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { productApi } from '@/lib/api-services';
import type { ApiProduct, Product } from '@/types';
import { useState, useEffect } from 'react';

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productApi.getProducts();
        const mappedProducts = response.data.map((p) => ({
          id: p.code,
          name: p.name,
          category: p.category?.name || p.category_code,
          price: p.selling_price,
          stock: 100,
          imageUrl: p.thumbnail,
          thumbnail: p.thumbnail,
          imageHint: p.description,
          uom: p.uom?.name || 'Unit',
        }));
        setProducts(mappedProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);
  return (  
    <ScrollArea className="h-full">
      <div className="grid grid-cols-2 gap-4 p-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </ScrollArea>
  );
}
