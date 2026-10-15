import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCardSkeleton } from "@/components/admin/stat-card";
import {
  CategoriesStat,
  ProductsStat,
  RecentProducts,
  UsersStat,
} from "@/components/admin/overview-stats";

export const metadata: Metadata = {
  title: "Overview",
};

// The numbers are counted from live API data on every visit
export const dynamic = "force-dynamic";

export default function AdminOverviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">
          A summary of your store, counted from the API.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<StatCardSkeleton label="Total products" />}>
          <ProductsStat />
        </Suspense>
        <Suspense fallback={<StatCardSkeleton label="Total categories" />}>
          <CategoriesStat />
        </Suspense>
        <Suspense fallback={<StatCardSkeleton label="Total users" />}>
          <UsersStat />
        </Suspense>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Quick links</h2>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/admin/products/new">Add product</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/categories/new">Add category</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/users">View users</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">View store</Link>
          </Button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Recently added products</h2>
        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <RecentProducts />
        </Suspense>
      </section>
    </div>
  );
}