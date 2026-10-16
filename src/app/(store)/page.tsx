import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SafeImage } from "@/components/shared/safe-image";
import { CategoryCard } from "@/components/categories/category-card";
import { ProductCard } from "@/components/products/product-card";
import { getCategories } from "@/lib/api/categories";
import { getProducts } from "@/lib/api/products";
import type { Category, Product } from "@/types";

export default async function Home() {
  let categories: Category[] = [];
  let products: Product[] = [];
  let error: string | null = null;

  try {
    [categories, products] = await Promise.all([
      getCategories(),
      getProducts({ offset: 0, limit: 8 }),
    ]);
  } catch (e) {
    error = e instanceof Error ? e.message : "Something went wrong.";
  }

  return (
    <div className="space-y-16">
                  {/* Hero */}
      <section className="grid items-center gap-10 py-4 md:grid-cols-[1fr_1.2fr] md:py-8">
        <div className="space-y-6 text-center md:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
           Shop smarter, live better
          </h1>
          <p className="mx-auto max-w-xl text-base text-muted-foreground md:mx-0 md:text-lg">
            Browse our catalog, search by name, and filter by category or price
            to find exactly what you need.
          </p>
          <div className="flex justify-center gap-3 pt-4 md:justify-start">
            <Button asChild size="lg">
              <Link href="/products">Shop Products</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/categories">Browse Categories</Link>
            </Button>
          </div>
        </div>

        <SafeImage
          src="/images/hero.jpg"
          alt="Shopping at Nexus Store"
          className="h-80 w-full rounded-lg border object-cover md:h-[34rem]"
        />
      </section>
            {error && (
        <Alert variant="destructive">
          <AlertTitle>Could not load the store</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>{error}</p>
            <Button asChild size="sm" variant="outline">
              <Link href="/">Try again</Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Categories */}
      {!error && (
        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold">Popular Categories</h2>
            <Link
              href="/categories"
              className="text-sm text-brand hover:underline"
            >
              All Categories
            </Link>
          </div>
          {categories.length === 0 ? (
            <p className="text-muted-foreground">No categories available.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {categories.slice(0, 4).map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Featured products */}
      {!error && (
        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold">Featured Products</h2>
              <p className="text-sm text-muted-foreground">
                Selections from our catalog
              </p>
            </div>
            <Link
              href="/products"
              className="text-sm text-brand hover:underline"
            >
              View All
            </Link>
          </div>
          {products.length === 0 ? (
            <p className="text-muted-foreground">No products available.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Call to action */}
      <section className="space-y-4 rounded-lg border bg-muted/50 p-8 text-center">
        <h2 className="text-2xl font-bold">Find something you will love</h2>
        <p className="mx-auto max-w-md text-muted-foreground">
          Explore all our categories, search for items by name, or filter by
          price.
        </p>
        <Button asChild>
          <Link href="/products">Explore Catalog</Link>
        </Button>
      </section>
    </div>
  );
}