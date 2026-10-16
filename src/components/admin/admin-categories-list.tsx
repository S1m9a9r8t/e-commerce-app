"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/shared/safe-image";
import { getCreatedCategoryIds } from "@/lib/admin-created";
import type { Category } from "@/types";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function AdminCategoriesList({
  categories,
}: {
  categories: Category[];
}) {
  const [mine, setMine] = useState<number[]>([]);

  // Which categories this browser created is saved in the browser
  useEffect(() => {
    setMine(getCreatedCategoryIds());
  }, []);

  if (categories.length === 0) {
    return (
      <div className="space-y-3 rounded-lg border border-dashed p-10 text-center">
        <h2 className="text-lg font-semibold">No categories yet</h2>
        <p className="text-muted-foreground">
          The API returned no categories. Create the first one.
        </p>
        <Button asChild>
          <Link href="/admin/categories/new">Add category</Link>
        </Button>
      </div>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <li
          key={category.id}
          className="overflow-hidden rounded-lg border bg-card"
        >
          <SafeImage
            src={category.image}
            alt={category.name}
            className="aspect-[4/3] w-full object-cover"
          />
          <div className="space-y-3 p-4">
            <div className="flex items-start justify-between gap-2">
              <h2 className="min-w-0 break-words font-semibold">
                {category.name}
              </h2>
              {mine.includes(category.id) && (
                <Badge variant="secondary" className="shrink-0">
                  Created by you
                </Badge>
              )}
            </div>

            <dl className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <dt className="text-muted-foreground">ID</dt>
                <dd>{category.id}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Updated</dt>
                <dd>{formatDate(category.updatedAt)}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-muted-foreground">Slug</dt>
                <dd className="break-all">{category.slug}</dd>
              </div>
            </dl>

            <div className="flex gap-2">
              <Button asChild size="sm" variant="outline" className="flex-1">
                <Link href={`/admin/categories/${category.id}/edit`}>Edit</Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="flex-1">
                <Link href={`/categories/${category.slug}`}>View products</Link>
              </Button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}