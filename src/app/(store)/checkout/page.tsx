import type { Metadata } from "next";
import { CheckoutForm } from "@/components/cart/checkout-form";
import { RequireAuth } from "@/components/auth/require-auth";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Enter your delivery information to place a simulated order.",
};

export default function CheckoutPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
      <RequireAuth>
        <CheckoutForm />
      </RequireAuth>
    </div>
  );
}