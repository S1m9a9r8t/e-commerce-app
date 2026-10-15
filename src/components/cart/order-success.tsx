"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SafeImage } from "@/components/shared/safe-image";
import { loadLastOrder } from "@/lib/order-storage";
import { formatPrice } from "@/lib/utils";
import type { SimulatedOrder } from "@/types";

export function OrderSuccess() {
  const [order, setOrder] = useState<SimulatedOrder | null>(null);
  const [checked, setChecked] = useState(false);

  // The order is saved in the browser, so we read it after the page opens
  useEffect(() => {
    setOrder(loadLastOrder());
    setChecked(true);
  }, []);

  if (!checked) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-3 rounded-lg border border-dashed p-10 text-center">
        <h1 className="text-2xl font-bold">No recent order</h1>
        <p className="text-muted-foreground">
          There is no order to show. Orders are only kept for this browser
          session.
        </p>
        <Button asChild>
          <Link href="/products">Continue shopping</Link>
        </Button>
      </div>
    );
  }

  const { customer, items, total } = order;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Thank you for your order!
        </h1>
        <p className="text-muted-foreground">
          Your order has been placed, {customer.fullName}.
        </p>
      </div>

      <Alert>
        <AlertTitle>Simulated checkout</AlertTitle>
        <AlertDescription>
          No payment was taken and no real order or shipment was created. This
          page only summarizes what you entered.
        </AlertDescription>
      </Alert>

      <section className="rounded-lg border">
        <h2 className="border-b p-4 font-semibold">Order summary</h2>
        <ul className="divide-y px-4">
          {items.map((item) => (
            <li key={item.productId} className="flex gap-3 py-3">
              <SafeImage
                src={item.image}
                alt={item.title}
                className="size-14 shrink-0 rounded-md object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">
                  {item.quantity} × {formatPrice(item.price)}
                </p>
              </div>
              <p className="text-sm font-medium">
                {formatPrice(item.price * item.quantity)}
              </p>
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t p-4 font-semibold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </section>

      <section className="space-y-3 rounded-lg border p-4">
        <h2 className="font-semibold">Delivery information</h2>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Name</dt>
            <dd className="font-medium">{customer.fullName}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Email</dt>
            <dd className="break-all font-medium">{customer.email}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Phone</dt>
            <dd className="font-medium">{customer.phone}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Address</dt>
            <dd className="font-medium">
              {customer.address}, {customer.city}
            </dd>
          </div>
        </dl>
      </section>

      <Button asChild size="lg">
        <Link href="/products">Continue shopping</Link>
      </Button>
    </div>
  );
}