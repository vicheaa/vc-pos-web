"use client";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { ApiProduct } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface ApiProductCardProps {
  product: ApiProduct;
  onClick?: () => void;
}

export function ApiProductCard({ product, onClick }: ApiProductCardProps) {
  return (
    <Card
      className={cn(
        "flex cursor-pointer flex-col overflow-hidden transition-all hover:shadow-lg active:scale-95",
        !product.is_active && "opacity-60"
      )}
      onClick={onClick}
    >
      <div className="relative aspect-square w-full bg-muted">
        <Image
          src={`${process.env.NEXT_PUBLIC_IMG_BASE_URL}/storage/${product.thumbnail}`}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover"
          priority={true}
        />
        {!product.is_active && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Badge variant="secondary">Inactive</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-3">
        <h3 className="truncate font-semibold">{product.name}</h3>
        {product.name_kh && (
          <p className="truncate text-sm text-muted-foreground font-khmer">
            {product.name_kh}
          </p>
        )}
        {product.category_code && (
          <p className="text-xs text-muted-foreground">
            {product.category_code}
          </p>
        )}
      </CardContent>
      <CardFooter className="mt-auto flex items-center justify-between p-3 pt-0">
        <p className="text-lg font-bold">${product.selling_price.toFixed(2)}</p>
        {product.uom && (
          <p className="text-xs text-muted-foreground font-khmer">
            {product.uom.name_kh || product.uom.name}
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
