"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { loadLastOrder } from "@/lib/order-storage";
import { formatPrice } from "@/lib/utils";
import type { SimulatedOrder } from "@/types";

export function LastOrderCard() {
  const [order, setOrder] = useState<SimulatedOrder | null>(null);

  // The order is saved in the browser, so we read it after the page opens
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser storage only exists after the page loads
    setOrder(loadLastOrder());
  }, []);

  if (!order) return null;

  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <section className="space-y-3 rounded-lg border p-4">
      <h2 className="font-semibold">Recent simulated order</h2>
      <p className="text-sm text-muted-foreground">
        {itemCount} {itemCount === 1 ? "item" : "items"} ·{" "}
        {formatPrice(order.total)} ·{" "}
        {new Date(order.placedAt).toLocaleString()}
      </p>
      <Button asChild variant="outline" size="sm">
        <Link href="/checkout/success">View order summary</Link>
      </Button>
    </section>
  );
}