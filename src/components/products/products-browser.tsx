"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCard } from "./product-card";
import type { Category, Product } from "@/types";

const PAGE_SIZE = 12;

type SortOption =
  | "newest"
  | "oldest"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc";

interface ProductsBrowserProps {
  products: Product[];
  categories: Category[];
}

export function ProductsBrowser({
  products,
  categories,
}: ProductsBrowserProps) {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState<SortOption>("oldest");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const min = minPrice === "" ? null : Number(minPrice);
    const max = maxPrice === "" ? null : Number(maxPrice);

    const result = products.filter((product) => {
      if (term && !product.title.toLowerCase().includes(term)) return false;
      if (categoryId !== "all" && String(product.category?.id) !== categoryId)
        return false;
      if (min !== null && product.price < min) return false;
      if (max !== null && product.price > max) return false;
      return true;
    });

    result.sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        case "oldest":
          return (
            new Date(a.creationAt).getTime() - new Date(b.creationAt).getTime()
          );
        default:
          return (
            new Date(b.creationAt).getTime() - new Date(a.creationAt).getTime()
          );
      }
    });

    return result;
  }, [products, search, categoryId, minPrice, maxPrice, sort]);

  const hasFilters =
    search !== "" || categoryId !== "all" || minPrice !== "" || maxPrice !== "";

  function resetPage() {
    setVisibleCount(PAGE_SIZE);
  }

  function clearFilters() {
    setSearch("");
    setCategoryId("all");
    setMinPrice("");
    setMaxPrice("");
    resetPage();
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2 lg:grid-cols-6">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              type="search"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetPage();
              }}
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={categoryId}
            onValueChange={(value) => {
              setCategoryId(value);
              resetPage();
            }}
          >
            <SelectTrigger id="category" className="w-full">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="min-price">Min price ($)</Label>
          <Input
            id="min-price"
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="0"
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value);
              resetPage();
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="max-price">Max price ($)</Label>
          <Input
            id="max-price"
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Any"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
              resetPage();
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sort">Sort by</Label>
          <Select
            value={sort}
            onValueChange={(value) => {
              setSort(value as SortOption);
              resetPage();
            }}
          >
            <SelectTrigger id="sort" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Oldest first</SelectItem>
              <SelectItem value="oldest">Newest first</SelectItem>
              <SelectItem value="price-asc">Price: low to high</SelectItem>
              <SelectItem value="price-desc">Price: high to low</SelectItem>
              <SelectItem value="name-asc">Name: A to Z</SelectItem>
              <SelectItem value="name-desc">Name: Z to A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Result count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {Math.min(visibleCount, filtered.length)} of {filtered.length}{" "}
          products
        </p>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="space-y-3 rounded-lg border border-dashed p-10 text-center">
          <h2 className="text-lg font-semibold">No products found</h2>
          <p className="text-muted-foreground">
            Try a different search, category or price range.
          </p>
          <Button variant="outline" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filtered.slice(0, visibleCount).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {visibleCount < filtered.length && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              >
                Load more
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}