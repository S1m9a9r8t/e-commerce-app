import type { Metadata } from "next";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AdminProductsTable } from "@/components/admin/admin-products-table";
import { RetryButton } from "@/components/shared/retry-button";
import { getProducts } from "@/lib/api/products";
import type { Product } from "@/types";

export const metadata: Metadata = {
  title: "Products",
};

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  let products: Product[] = [];
  let error: string | null = null;

  try {
    products = await getProducts({}, { cache: "no-store" });
  } catch (e) {
    error = e instanceof Error ? e.message : "Something went wrong.";
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            View and manage the products in the store.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">Add product</Link>
        </Button>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Could not load products</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>{error}</p>
            <RetryButton />
          </AlertDescription>
        </Alert>
      ) : (
        <AdminProductsTable products={products} />
      )}
    </div>
  );
}