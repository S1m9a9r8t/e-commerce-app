import type { Metadata } from "next";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ProductsBrowser } from "@/components/products/products-browser";
import { getCategories } from "@/lib/api/categories";
import { getProducts } from "@/lib/api/products";
import type { Category, Product } from "@/types";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse, search, filter and sort all products in our catalog.",
};

export default async function ProductsPage() {
  let products: Product[] = [];
  let categories: Category[] = [];
  let error: string | null = null;

  try {
    [products, categories] = await Promise.all([
      getProducts(),
      getCategories(),
    ]);
  } catch (e) {
    error = e instanceof Error ? e.message : "Something went wrong.";
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
        <p className="text-muted-foreground">
          Search, filter and sort our catalog.
        </p>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Could not load products</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>{error}</p>
            <Button asChild size="sm" variant="outline">
              <Link href="/products">Try again</Link>
            </Button>
          </AlertDescription>
        </Alert>
      ) : products.length === 0 ? (
        <p className="text-muted-foreground">No products available.</p>
      ) : (
        <ProductsBrowser products={products} categories={categories} />
      )}
    </div>
  );
}