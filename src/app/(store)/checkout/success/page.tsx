import type { Metadata } from "next";
import { OrderSuccess } from "@/components/cart/order-success";
import { RequireAuth } from "@/components/auth/require-auth";

export const metadata: Metadata = {
  title: "Order Confirmation",
  description: "Your simulated order confirmation.",
};

export default function CheckoutSuccessPage() {
  return (
    <RequireAuth>
      <OrderSuccess />
    </RequireAuth>
  );
}