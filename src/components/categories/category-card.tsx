import Link from "next/link";
import { SafeImage } from "@/components/shared/safe-image";
import type { Category } from "@/types";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group overflow-hidden rounded-lg border bg-card"
    >
      <SafeImage
        src={category.image}
        alt={category.name}
        className="aspect-[4/3] w-full object-cover"
      />
      <div className="flex items-center justify-between p-3">
        <span className="truncate font-medium">{category.name}</span>
        <span className="text-sm text-muted-foreground group-hover:text-brand">
          Browse →
        </span>
      </div>
    </Link>
  );
}