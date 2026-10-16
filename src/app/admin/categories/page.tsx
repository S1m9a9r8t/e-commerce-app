import type { Metadata } from "next";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AdminCategoriesList } from "@/components/admin/admin-categories-list";
import { RetryButton } from "@/components/shared/retry-button";
import { getCategories } from "@/lib/api/categories";
import type { Category } from "@/types";

export const metadata: Metadata = {
  title: "Categories",
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ created?: string; updated?: string }>;
};

export default async function AdminCategoriesPage({ searchParams }: PageProps) {
  const { created, updated } = await searchParams;

  let categories: Category[] = [];
  let error: string | null = null;

  try {
    categories = await getCategories({ cache: "no-store" });
  } catch (e) {
    error = e instanceof Error ? e.message : "Something went wrong.";
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            View and manage the product categories.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/categories/new">Add category</Link>
        </Button>
      </div>

      {(created || updated) && (
        <Alert role="status">
          <AlertTitle>
            {created ? "Category created" : "Category updated"}
          </AlertTitle>
          <AlertDescription>
            The API accepted your {created ? "new category" : "changes"}. Store
            pages keep answers for up to a minute, so it may take a moment to
            show there.
          </AlertDescription>
        </Alert>
      )}

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Could not load categories</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>{error}</p>
            <RetryButton />
          </AlertDescription>
        </Alert>
      ) : (
        <AdminCategoriesList categories={categories} />
      )}
    </div>
  );
}