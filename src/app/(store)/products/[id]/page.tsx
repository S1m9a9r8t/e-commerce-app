import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AddToCart } from "@/components/products/add-to-cart";
import { ProductCard } from "@/components/products/product-card";
import { ProductGallery } from "@/components/products/product-detail";
import { ApiError } from "@/lib/api/client";
import { getProduct, getRelatedProducts } from "@/lib/api/products";
import { cleanImageUrl, formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

type PageProps = { params: Promise<{ id: string }> };

type LoadResult =
  | { status: "ok"; product: Product }
  | { status: "not-found" }
  | { status: "error"; message: string };


const loadProduct = cache(async (rawId: string): Promise<LoadResult> => {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) return { status: "not-found" };

  try {
    const product = await getProduct(id);
    if (!product?.id) return { status: "not-found" };
    return { status: "ok", product };
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
  const { id } = await params;
  const result = await loadProduct(id);

  if (result.status !== "ok") {
    return { title: "Product not found" };
  }

  const { product } = result;
  const image = cleanImageUrl(product.images?.[0]);

  return {
    title: product.title,
    description: product.description?.slice(0, 160),
    openGraph: image ? { images: [image] } : undefined,
  };
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const result = await loadProduct(id);

  if (result.status === "not-found") {
    return (
      <div className="space-y-4 rounded-lg border border-dashed p-10 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="text-muted-foreground">
          This product does not exist or is no longer available.
        </p>
        <Button asChild>
          <Link href="/products">Back to products</Link>
        </Button>
      </div>
    );
  }

  if (result.status === "error") {
    return (
      <Alert variant="destructive">
        <AlertTitle>Could not load this product</AlertTitle>
        <AlertDescription className="space-y-3">
          <p>{result.message}</p>
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href={`/products/${id}`}>Try again</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/products">Back to products</Link>
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  const { product } = result;

  // Related products 
  let related: Product[] = [];
  try {
    const items = await getRelatedProducts(product.id);
    related = items.filter((item) => item.id !== product.id).slice(0, 4);
  } catch {
    related = [];
  }

  return (
    <div className="space-y-12">
      <div>
        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand"
        >
          <ArrowLeft className="size-4" />
          Back to products
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <ProductGallery images={product.images ?? []} title={product.title} />

        <div className="space-y-6">
          <div className="space-y-2">
            {product.category && (
              <Link
                href={`/categories/${product.category.slug}`}
                className="text-sm text-brand hover:underline"
              >
                {product.category.name}
              </Link>
            )}
            <h1 className="text-3xl font-bold tracking-tight">
              {product.title}
            </h1>
            <p className="text-2xl font-semibold">
              {formatPrice(product.price)}
            </p>
          </div>

          <p className="leading-relaxed text-muted-foreground">
            {product.description || "No description available."}
          </p>

          <AddToCart product={product} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Related Products</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}