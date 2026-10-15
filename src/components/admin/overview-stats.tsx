import { cache } from "react";
import Link from "next/link";
import { SafeImage } from "@/components/shared/safe-image";
import { RetryButton } from "@/components/shared/retry-button";
import { getCategories } from "@/lib/api/categories";
import { getProducts } from "@/lib/api/products";
import { getUsers } from "@/lib/api/users";
import { formatPrice } from "@/lib/utils";
import { StatCard } from "./stat-card";


const loadProducts = cache(async () => {
  try {
    const data = await getProducts();
    return Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
});

const loadCategories = cache(async () => {
  try {
    const data = await getCategories();
    return Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
});

const loadUsers = cache(async () => {
  try {
    const data = await getUsers();
    return Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
});

export async function ProductsStat() {
  const products = await loadProducts();
  return (
    <StatCard
      label="Total products"
      value={products ? products.length : null}
      href="/admin/products"
      linkLabel="Manage products"
    />
  );
}

export async function CategoriesStat() {
  const categories = await loadCategories();
  return (
    <StatCard
      label="Total categories"
      value={categories ? categories.length : null}
      href="/admin/categories"
      linkLabel="Manage categories"
    />
  );
}

export async function UsersStat() {
  const users = await loadUsers();
  return (
    <StatCard
      label="Total users"
      value={users ? users.length : null}
      href="/admin/users"
      linkLabel="View users"
    />
  );
}

export async function RecentProducts() {
  const products = await loadProducts();

  if (!products) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed p-6">
        <p className="text-sm text-muted-foreground">
          Recent products are unavailable right now.
        </p>
        <RetryButton />
      </div>
    );
  }

  if (products.length === 0) {
    return <p className="text-muted-foreground">No products yet.</p>;
  }

  const recent = [...products]
    .sort(
      (a, b) =>
        new Date(b.creationAt).getTime() - new Date(a.creationAt).getTime()
    )
    .slice(0, 5);

  return (
    <ul className="divide-y rounded-lg border">
      {recent.map((product) => (
        <li key={product.id} className="flex items-center gap-3 p-3">
          <SafeImage
            src={product.images?.[0]}
            alt={product.title}
            className="size-12 shrink-0 rounded-md object-cover"
          />
          <div className="min-w-0 flex-1">
            <Link
              href={`/admin/products/${product.id}`}
              className="block truncate text-sm font-medium hover:text-brand"
            >
              {product.title}
            </Link>
            <p className="truncate text-xs text-muted-foreground">
              {product.category?.name ?? "No category"} · added{" "}
              {new Date(product.creationAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          <p className="text-sm font-semibold">{formatPrice(product.price)}</p>
        </li>
      ))}
    </ul>
  );
}