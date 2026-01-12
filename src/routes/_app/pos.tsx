import { createFileRoute } from "@tanstack/react-router";
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
import { cacheProducts, getCachedProducts } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/_app/pos")({
  component: POSPage,
});

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

  const [cachedProducts, setCachedProducts] = useState<Product[]>([]);
  const { toast } = useToast();

  // Map API products to POS products
  const mappedProducts: Product[] = data?.data.map((p) => ({
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

  // Cache products when data is available
  useEffect(() => {
    if (mappedProducts.length > 0) {
      cacheProducts(mappedProducts).catch(console.error);
    }
  }, [data]);

  // Load cached products on error or if offline
  useEffect(() => {
    if (error || !navigator.onLine) {
      getCachedProducts().then((products) => {
        if (products.length > 0) {
          setCachedProducts(products);
          toast({
            title: "Offline Mode",
            description: "Loaded products from cache.",
          });
        }
      });
    }
  }, [error]);

  const displayProducts = mappedProducts.length > 0 ? mappedProducts : cachedProducts;

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

  // Inside POSContent function...

  return (
    // 1. MAIN GRID CONTAINER
    // h-[calc(100vh-4rem)]: Forces full height minus header
    <div className="flex gap-4" >
      
      <Card className="w-1/2">

        {/* 2. LEFT SIDE (PRODUCTS) - Spans 8/12 columns */}
        <div className="flex flex-col gap-4 overflow-hidden">
          
          {/* Search & Filter Bar */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[180px] bg-background">
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

            {(selectedCategory !== "all" || searchInput) && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleClearFilters}
                title="Clear filters"
                className="shrink-0 bg-background"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* 3. PRODUCT GRID CONTAINER 
              flex-1: Fills remaining vertical space.
              min-h-0: CRITICAL. Prevents flex items from overflowing their parent.
              overflow-hidden: Ensures the internal ScrollArea handles the scrolling.
          */}
          <div className="flex-1 min-h-0 overflow-hidden rounded-lg border bg-white p-2 shadow-sm">
            <ProductGrid 
              products={displayProducts} 
              isLoading={isLoading && displayProducts.length === 0} 
              error={error && displayProducts.length === 0 ? error : null} 
            />
          </div>

          {/* Pagination */}
          {data && data.total > ITEMS_PER_PAGE && (
            <div className="flex justify-center py-2">
              <Pagination
                currentPage={currentPage}
                totalItems={data.total}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </Card>

      {/* 4. RIGHT SIDE (CART) - Spans 4/12 columns */}
      <div className="w-1/2 h-full overflow-hidden rounded-lg border bg-background shadow-sm">
        <Cart />
      </div>
    </div>
  );
}

function POSPage() {
  return (
    <ProtectedRoute permissions={[Permission.VIEW_POS]}>
      <POSContent />
    </ProtectedRoute>
  );
}
