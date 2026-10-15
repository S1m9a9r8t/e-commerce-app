import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ProductForm } from "@/components/admin/product-form";
import { RetryButton } from "@/components/shared/retry-button";
import { getCategories } from "@/lib/api/categories";
import type { Category } from "@/types";

export const metadata: Metadata = {
  title: "Add product",
};

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  let categories: Category[] = [];
  let error: string | null = null;

  try {
    categories = await getCategories();
  } catch (e) {
    error = e instanceof Error ? e.message : "Something went wrong.";
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand"
      >
        <ArrowLeft className="size-4" />
        All products
      </Link>

      <h1 className="text-3xl font-bold tracking-tight">Add product</h1>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Could not load categories</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>
              The form needs the category list from the API. {error}
            </p>
            <RetryButton />
          </AlertDescription>
        </Alert>
      ) : (
        <ProductForm mode="create" categories={categories} />
      )}
    </div>
  );
}