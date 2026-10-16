import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CategoryForm } from "@/components/admin/category-form";
import { RetryButton } from "@/components/shared/retry-button";
import { ApiError } from "@/lib/api/client";
import { getCategory } from "@/lib/api/categories";
import type { Category } from "@/types";

export const metadata: Metadata = {
  title: "Edit category",
};

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function EditCategoryPage({ params }: PageProps) {
  const { id: rawId } = await params;
  const id = Number(rawId);

  const notFound = (
    <div className="space-y-4 rounded-lg border border-dashed p-10 text-center">
      <h1 className="text-2xl font-bold">Category not found</h1>
      <p className="text-muted-foreground">
        This category does not exist or was removed from the API.
      </p>
      <Button asChild>
        <Link href="/admin/categories">Back to categories</Link>
      </Button>
    </div>
  );

  if (!Number.isInteger(id) || id <= 0) return notFound;

  let category: Category | null = null;
  let error: string | null = null;

  try {
    const data = await getCategory(id, { cache: "no-store" });
    category = data?.id ? data : null;
  } catch (e) {
    if (e instanceof ApiError && (e.status === 400 || e.status === 404)) {
      return notFound;
    }
    error = e instanceof Error ? e.message : "Something went wrong.";
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Could not load this category</AlertTitle>
        <AlertDescription className="space-y-3">
          <p>{error}</p>
          <div className="flex gap-2">
            <RetryButton />
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/categories">Back to categories</Link>
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (!category) return notFound;

  return (
    <div className="space-y-6">
      <Link
        href="/admin/categories"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand"
      >
        <ArrowLeft className="size-4" />
        All categories
      </Link>

      <h1 className="text-3xl font-bold tracking-tight">Edit category</h1>

      <dl className="grid max-w-xl gap-4 rounded-lg border p-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">ID</dt>
          <dd className="font-medium">{category.id}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Slug</dt>
          <dd className="break-all font-medium">{category.slug}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Created</dt>
          <dd className="font-medium">{formatDateTime(category.creationAt)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Last updated</dt>
          <dd className="font-medium">{formatDateTime(category.updatedAt)}</dd>
        </div>
      </dl>

      <CategoryForm mode="edit" category={category} />
    </div>
  );
}