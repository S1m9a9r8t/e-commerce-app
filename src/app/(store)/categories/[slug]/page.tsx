import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
import { ApiError } from "@/lib/api/client";
import {
  getCategoryBySlug,
  getCategoryProducts,
} from "@/lib/api/categories";
import type { Category, Product } from "@/types";

type PageProps = { params: Promise<{ slug: string }> };

type LoadResult =
  | { status: "ok"; category: Category }
  | { status: "not-found" }
  | { status: "error"; message: string };

// cache() means the category is fetched once, even though both
// generateMetadata and the page need it
const loadCategory = cache(async (slug: string): Promise<LoadResult> => {
  try {
    const category = await getCategoryBySlug(slug);
    if (!category?.id) return { status: "not-found" };
    return { status: "ok", category };
  } catch (e) {
    if (e instanceof ApiError && (e.status === 400 || e.status === 404)) {
      return { status: "not-found" };
    }
    return {
      status: "error",
      message: e instanceof Error ? e.message : "Something went wrong.",
    };
  }
});

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await loadCategory(slug);

  if (result.status !== "ok") {
    return { title: "Category not found" };
  }

  return {
    title: result.category.name,
    description: `Browse ${result.category.name} products in our store.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await loadCategory(slug);

  if (result.status === "not-found") {
    return (
      <div className="space-y-4 rounded-lg border border-dashed p-10 text-center">
        <h1 className="text-2xl font-bold">Category not found</h1>
        <p className="text-muted-foreground">
          This category does not exist or is no longer available.
        </p>
        <Button asChild>
          <Link href="/categories">Back to categories</Link>
        </Button>
      </div>
    );
  }

  if (result.status === "error") {
    return (
      <Alert variant="destructive">
        <AlertTitle>Could not load this category</AlertTitle>
        <AlertDescription className="space-y-3">
          <p>{result.message}</p>
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href={`/categories/${slug}`}>Try again</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/categories">Back to categories</Link>
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  const { category } = result;

  let products: Product[] = [];
  let productsError: string | null = null;

  try {
    products = await getCategoryProducts(category.id);
  } catch (e) {
    productsError =
      e instanceof Error ? e.message : "Could not load products.";
  }

  return (
    <div className="space-y-6">
      <Link
        href="/categories"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand"
      >
        <ArrowLeft className="size-4" />
        All categories
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
        {!productsError && (
          <p className="text-muted-foreground">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        )}
      </div>

      {productsError ? (
        <Alert variant="destructive">
          <AlertTitle>Could not load products</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>{productsError}</p>
            <Button asChild size="sm" variant="outline">
              <Link href={`/categories/${slug}`}>Try again</Link>
            </Button>
          </AlertDescription>
        </Alert>
      ) : products.length === 0 ? (
        <div className="space-y-3 rounded-lg border border-dashed p-10 text-center">
          <h2 className="text-lg font-semibold">No products yet</h2>
          <p className="text-muted-foreground">
            There are no products in this category right now.
          </p>
          <Button asChild variant="outline">
            <Link href="/categories">Browse other categories</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}