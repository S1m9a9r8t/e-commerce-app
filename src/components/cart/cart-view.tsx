"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { SafeImage } from "@/components/shared/safe-image";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";

export function CartView() {
  const {
    items,
    isReady,
    totalItems,
    subtotal,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
  } = useCart();

  
  if (!isReady) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="space-y-3 rounded-lg border border-dashed p-10 text-center">
        <h2 className="text-lg font-semibold">Your cart is empty</h2>
        <p className="text-muted-foreground">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Button asChild>
          <Link href="/products">Continue shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      {/* Items */}
      <ul className="divide-y rounded-lg border">
        {items.map((item) => (
          <li key={item.productId} className="flex gap-4 p-4">
            <Link href={`/products/${item.productId}`} className="shrink-0">
              <SafeImage
                src={item.image}
                alt={item.title}
                className="size-20 rounded-md object-cover sm:size-24"
              />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <Link
                  href={`/products/${item.productId}`}
                  className="line-clamp-2 text-sm font-medium hover:text-brand"
                >
                  {item.title}
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove ${item.title} from cart`}
                  onClick={() => removeItem(item.productId)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                {formatPrice(item.price)} each
              </p>

              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center rounded-md border">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Decrease quantity of ${item.title}`}
                    disabled={item.quantity <= 1}
                    onClick={() => decreaseQuantity(item.productId)}
                  >
                    <Minus className="size-4" />
                  </Button>
                  <span
                    className="w-10 text-center text-sm font-medium"
                    aria-live="polite"
                  >
                    {item.quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Increase quantity of ${item.title}`}
                    onClick={() => increaseQuantity(item.productId)}
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>

                <p className="font-semibold">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

     
      <aside className="h-fit space-y-4 rounded-lg border p-6">
        <h2 className="text-lg font-semibold">Order Summary</h2>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total items</span>
            <span>{totalItems}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <div className="space-y-2">
          <Button asChild className="w-full" size="lg">
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/products">Continue shopping</Link>
          </Button>
          <Button variant="ghost" className="w-full" onClick={clearCart}>
            Clear cart
          </Button>
        </div>
      </aside>
    </div>
  );
}