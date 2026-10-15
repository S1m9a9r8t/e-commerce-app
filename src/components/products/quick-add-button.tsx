"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import type { Product } from "@/types";

export function QuickAddButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Button
      size="sm"
      className="h-7 px-3 text-xs"
      onClick={handleClick}
      aria-label={`Add ${product.title} to cart`}
    >
      {added ? "Added" : "Add"}
    </Button>
  );
}