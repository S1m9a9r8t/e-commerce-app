"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SafeImage } from "@/components/shared/safe-image";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

const PAGE_SIZE = 20;

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function AdminProductsTable({ products }: { products: Product[] }) {
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Newest first, so a product you just created is at the top
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const sorted = [...products].sort(
      (a, b) =>
        new Date(b.creationAt).getTime() - new Date(a.creationAt).getTime()
    );
    if (!term) return sorted;
    return sorted.filter(
      (product) =>
        product.title.toLowerCase().includes(term) ||
        String(product.id) === term ||
        (product.category?.name ?? "").toLowerCase().includes(term)
    );
  }, [products, search]);

  const visible = filtered.slice(0, visibleCount);

  if (products.length === 0) {
    return (
      <div className="space-y-3 rounded-lg border border-dashed p-10 text-center">
        <h2 className="text-lg font-semibold">No products yet</h2>
        <p className="text-muted-foreground">
          The API returned no products. Create the first one.
        </p>
        <Button asChild>
          <Link href="/admin/products/new">Add product</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="max-w-sm space-y-2">
        <Label htmlFor="admin-search">Search products</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="admin-search"
            type="search"
            placeholder="Title, category or ID..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            className="pl-9"
          />
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {visible.length} of {filtered.length} products
      </p>

      {filtered.length === 0 ? (
        <div className="space-y-3 rounded-lg border border-dashed p-10 text-center">
          <h2 className="text-lg font-semibold">No products match</h2>
          <p className="text-muted-foreground">
            Try a different title, category or ID.
          </p>
          <Button variant="outline" onClick={() => setSearch("")}>
            Clear search
          </Button>
        </div>
      ) : (
        <>
          {/* Table on tablets and desktops */}
          <div className="hidden rounded-lg border md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <SafeImage
                        src={product.images?.[0]}
                        alt={product.title}
                        className="size-10 rounded-md object-cover"
                      />
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="block truncate font-medium hover:text-brand"
                      >
                        {product.title}
                      </Link>
                      <span className="text-xs text-muted-foreground">
                        ID {product.id}
                      </span>
                    </TableCell>
                    <TableCell>{product.category?.name ?? "None"}</TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                    <TableCell>{formatDate(product.creationAt)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/admin/products/${product.id}`}>
                            View
                          </Link>
                        </Button>
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/admin/products/${product.id}/edit`}>
                            Edit
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Card list on phones */}
          <ul className="space-y-3 md:hidden">
            {visible.map((product) => (
              <li key={product.id} className="space-y-3 rounded-lg border p-3">
                <div className="flex gap-3">
                  <SafeImage
                    src={product.images?.[0]}
                    alt={product.title}
                    className="size-16 shrink-0 rounded-md object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="line-clamp-2 text-sm font-medium hover:text-brand"
                    >
                      {product.title}
                    </Link>
                    <p className="truncate text-xs text-muted-foreground">
                      {product.category?.name ?? "None"} · ID {product.id}
                    </p>
                    <p className="text-sm font-semibold">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button asChild size="sm" variant="outline" className="flex-1">
                    <Link href={`/admin/products/${product.id}`}>View</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="flex-1">
                    <Link href={`/admin/products/${product.id}/edit`}>
                      Edit
                    </Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          {visibleCount < filtered.length && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              >
                Load more
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}