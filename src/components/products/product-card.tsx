import Link from "next/link";
import { SafeImage } from "@/components/shared/safe-image";
import { QuickAddButton } from "./quick-add-button";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group overflow-hidden rounded-lg border bg-card">
      <Link href={`/products/${product.id}`}>
        <SafeImage
          src={product.images[0]}
          alt={product.title}
          className="aspect-square w-full object-cover"
        />
      </Link>
      <div className="space-y-1 p-3">
        <p className="truncate text-xs text-muted-foreground">
          {product.category?.name}
        </p>
        <h3 className="line-clamp-2 text-sm font-medium">
          <Link href={`/products/${product.id}`} className="hover:text-brand">
            {product.title}
          </Link>
        </h3>
        <div className="flex items-center justify-between pt-1">
          <p className="font-semibold">{formatPrice(product.price)}</p>
          <QuickAddButton product={product} />
        </div>
      </div>
    </div>
  );
}