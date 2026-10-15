import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RetryButton } from "@/components/shared/retry-button";
import { SafeImage } from "@/components/shared/safe-image";
import { ApiError } from "@/lib/api/client";
import { getProduct } from "@/lib/api/products";
import { cleanImageUrl, formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

export const metadata: Metadata = {
  title: "Product details",
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

export default async function AdminProductDetailsPage({ params }: PageProps) {
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
  let error: string | null = null;

  try {
    const data = await getProduct(id, { cache: "no-store" });
    product = data?.id ? data : null;
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

  const images = (product.images ?? []).map(cleanImageUrl).filter(Boolean);

  return (
    <div className="space-y-6">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand"
      >
        <ArrowLeft className="size-4" />
        All products
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="break-words text-2xl font-bold tracking-tight md:text-3xl">
            {product.title}
          </h1>
          <p className="text-sm text-muted-foreground">ID {product.id}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/products/${product.id}`}>View in store</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section aria-label="Images" className="space-y-3">
          <h2 className="font-semibold">Images</h2>
          {images.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              This product has no images.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {images.map((url, index) => (
                <SafeImage
                  key={url + index}
                  src={url}
                  alt={`${product.title}, image ${index + 1}`}
                  className="aspect-square w-full rounded-lg border object-cover"
                />
              ))}
            </div>
          )}
        </section>

        <section aria-label="Details" className="space-y-4">
          <h2 className="font-semibold">Details</h2>
          <dl className="grid gap-4 rounded-lg border p-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Price</dt>
              <dd className="font-medium">{formatPrice(product.price)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Category</dt>
              <dd className="font-medium">
                {product.category
                  ? `${product.category.name} (ID ${product.category.id})`
                  : "None"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Created</dt>
              <dd className="font-medium">
                {formatDateTime(product.creationAt)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Last updated</dt>
              <dd className="font-medium">
                {formatDateTime(product.updatedAt)}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">Description</dt>
              <dd className="whitespace-pre-line break-words">
                {product.description || "No description."}
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}