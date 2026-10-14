"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";

const MAX_QUANTITY = 99;

export function AddToCart({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);

  function handleAdd() {
    // TODO (cart phase): add `product` with `quantity` to the cart
    console.log("Add to cart (not connected yet):", product.id, quantity);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Quantity</span>
        <div className="flex items-center rounded-md border">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <Minus className="size-4" />
          </Button>
          <span
            className="w-10 text-center text-sm font-medium"
            aria-live="polite"
          >
            {quantity}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Increase quantity"
            disabled={quantity >= MAX_QUANTITY}
            onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </div>

      <Button size="lg" className="w-full sm:w-auto" onClick={handleAdd}>
        Add to Cart
      </Button>
    </div>
  );
}