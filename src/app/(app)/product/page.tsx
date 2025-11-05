"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProducts } from "@/hooks/useProductQueries";
import { useCategories } from "@/hooks/useCategoryQueries";
import { ApiProductCard } from "@/components/products/ApiProductCard";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 20;
const SEARCH_DEBOUNCE_MS = 300;

export default function ProductsPage() {
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
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (value: string) => {
    setSearchInput(value);
    // Note: Current page reset is handled by the debounce useEffect
  };

  const handleCategoryChange = (categoryCode: string) => {
    setSelectedCategory(categoryCode);
    setCurrentPage(1); // Reset to first page on category change
  };

  const handleClearFilters = () => {
    setSelectedCategory("all");
    setSearchInput("");
    setDebouncedSearch("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            Manage and browse your product catalog
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchInput}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Category Filter */}
              <div className="sm:w-[220px]">
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
                        <div className="flex justify-center items-center gap-2">
                          <span>{category.name}</span>
                          {category.name_kh && (
                            <span className="text-xs text-muted-foreground font-khmer">
                              {category.name_kh}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters Button */}
              {(selectedCategory !== "all" || searchInput) && (
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="sm:w-auto"
                >
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Active Filters Display */}
            {(selectedCategory !== "all" || debouncedSearch) && (
              <div className="flex flex-wrap gap-2 text-sm">
                {debouncedSearch && (
                  <span className="rounded-md bg-secondary px-3 py-1">
                    Search: "{debouncedSearch}"
                  </span>
                )}
                {selectedCategory !== "all" && categoriesData && (
                  <span className="rounded-md bg-secondary px-3 py-1">
                    Category:{" "}
                    {
                      categoriesData.find((c) => c.code === selectedCategory)
                        ?.name
                    }
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Error State */}
          {error && (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-center text-destructive">
              <p>Failed to load products. Please try again.</p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          )}

          {/* Products Grid */}
          {!isLoading && !error && data && (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                Showing {data.data.length} of {data.total} products
              </div>
              {data.data.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <p>No products found.</p>
                  {debouncedSearch && (
                    <p className="mt-2 text-sm">
                      Try adjusting your search terms.
                    </p>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {data.data.map((product) => (
                    <ApiProductCard key={product.code} product={product} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {data.total > ITEMS_PER_PAGE && (
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalItems={data.total}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
