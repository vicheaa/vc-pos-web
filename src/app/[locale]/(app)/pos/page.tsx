"use client";

import { useState, useEffect } from "react";
import { ProductGrid } from "@/components/features/pos/ProductGrid";
import { Cart } from "@/components/features/pos/Cart";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Permission } from "@/lib/permissions";
import { useProducts } from "@/hooks/useProductQueries";
import { useCategories } from "@/hooks/useCategoryQueries";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";

const ITEMS_PER_PAGE = 20;
const SEARCH_DEBOUNCE_MS = 300;

function POSContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setCurrentPage(1);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: categoriesData } = useCategories();
  const { data, isLoading, error } = useProducts({
    page: currentPage,
    perPage: ITEMS_PER_PAGE,
    search: debouncedSearch || undefined,
    categoryCode: selectedCategory === "all" ? undefined : selectedCategory,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (value: string) => {
    setSearchInput(value);
  };

  const handleCategoryChange = (categoryCode: string) => {
    setSelectedCategory(categoryCode);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedCategory("all");
    setSearchInput("");
    setDebouncedSearch("");
    setCurrentPage(1);
  };

  // Map API products to POS products
  const products: Product[] = data?.data.map((p) => ({
    id: p.code,
    name: p.name,
    category: p.category?.name || p.category_code,
    price: p.selling_price,
    stock: 100, // Default stock for now as per previous implementation
    imageUrl: p.thumbnail,
    thumbnail: p.thumbnail,
    imageHint: p.description,
    uom: p.uom?.name || 'Unit',
  })) || [];

  return (
    <div className="grid h-[calc(100vh-8rem)] grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="flex flex-col gap-4 lg:col-span-2 h-full overflow-hidden p-2">
        {/* Search and Filter Bar */}
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="sm:w-[200px]">
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 shrink-0" />
                  <SelectValue placeholder="All Categories" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categoriesData?.map((category) => (
                  <SelectItem key={category.code} value={category.code}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(selectedCategory !== "all" || searchInput) && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleClearFilters}
              title="Clear filters"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-hidden rounded-lg border bg-background p-2">
          <ProductGrid 
            products={products} 
            isLoading={isLoading} 
            error={error} 
          />
        </div>

        {/* Pagination */}
        {data && data.total > ITEMS_PER_PAGE && (
          <div className="py-2">
            <Pagination
              currentPage={currentPage}
              totalItems={data.total}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      <div className="sticky top-20 lg:col-span-1 h-[80vh] overflow-y-auto">
        <Cart />
      </div>
    </div>
  );
}

export default function POSPage() {
  return (
    <ProtectedRoute permissions={[Permission.VIEW_POS]}>
      <POSContent />
    </ProtectedRoute>
  );
}
