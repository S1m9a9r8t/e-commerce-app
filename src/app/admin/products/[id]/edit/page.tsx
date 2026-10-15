import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/admin/product-form";
import { RetryButton } from "@/components/shared/retry-button";
import { ApiError } from "@/lib/api/client";
import { getCategories } from "@/lib/api/categories";
import { getProduct } from "@/lib/api/products";
import type { Category, Product } from "@/types";

export const metadata: Metadata = {
  title: "Edit product",
};

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: PageProps) {
  const { id: rawId } = await params;
  const id = Number(rawId);

  const notFound = (
    <div className="space-y-4 rounded-lg border border-dashed p-10 text-center">
      <h1 className="text-2xl font-bold">Product not found</h1>
      <p className="text-muted-foreground">
        This product does not exist or was removed from the API.
      </p>
      <Button asChild>
        <Link href="/admin/products">Back to products</Link>
      </Button>
    </div>
  );

  if (!Number.isInteger(id) || id <= 0) return notFound;

  let product: Product | null = null;
  let categories: Category[] = [];
  let error: string | null = null;

  try {
    const [loadedProduct, loadedCategories] = await Promise.all([
      getProduct(id, { cache: "no-store" }),
      getCategories(),
    ]);
    product = loadedProduct?.id ? loadedProduct : null;
    categories = loadedCategories;
  } catch (e) {
    if (e instanceof ApiError && (e.status === 400 || e.status === 404)) {
      return notFound;
    }
    error = e instanceof Error ? e.message : "Something went wrong.";
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Could not load this product</AlertTitle>
        <AlertDescription className="space-y-3">
          <p>{error}</p>
          <div className="flex gap-2">
            <RetryButton />
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/products">Back to products</Link>
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (!product) return notFound;

  return (
    <div className="space-y-6">
      <Link
        href={`/admin/products/${product.id}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand"
      >
        <ArrowLeft className="size-4" />
        Back to details
      </Link>

      <h1 className="text-3xl font-bold tracking-tight">Edit product</h1>

      <ProductForm mode="edit" categories={categories} product={product} />
    </div>
  );
}