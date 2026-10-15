"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { FormField } from "@/components/shared/form-field";
import { SafeImage } from "@/components/shared/safe-image";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { saveLastOrder } from "@/lib/order-storage";
import { formatPrice } from "@/lib/utils";
import type { CheckoutFormData } from "@/types";

type FormErrors = Partial<Record<keyof CheckoutFormData, string>>;

function validate(values: CheckoutFormData): FormErrors {
  const errors: FormErrors = {};

  if (values.fullName.trim().length < 2) {
    errors.fullName = "Enter your full name.";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  const phone = values.phone.trim();
  if (!phone) {
    errors.phone = "Phone number is required.";
  } else if (
    !/^[+()\-\s\d]+$/.test(phone) ||
    phone.replace(/\D/g, "").length < 7
  ) {
    errors.phone = "Enter a valid phone number.";
  }

  if (values.address.trim().length < 5) {
    errors.address = "Enter your delivery address.";
  }

  if (values.city.trim().length < 2) {
    errors.city = "City is required.";
  }

  return errors;
}

export function CheckoutForm() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, isReady, totalItems, subtotal, clearCart } = useCart();

  const [values, setValues] = useState<CheckoutFormData>({
    fullName: user?.name ?? "",
    email: user?.email ?? "",
    phone: "",
    address: "",
    city: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  function setField(field: keyof CheckoutFormData) {
    return (value: string) =>
      setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setIsSubmitting(true);

    // Simulated processing. No request is sent anywhere.
    await new Promise((resolve) => setTimeout(resolve, 600));

    saveLastOrder({
      items,
      customer: {
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        address: values.address.trim(),
        city: values.city.trim(),
      },
      total: subtotal,
      placedAt: new Date().toISOString(),
    });

    setCompleted(true);
    clearCart();
    router.push("/checkout/success");
  }

  if (!isReady) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (completed) {
    return (
      <p role="status" className="text-muted-foreground">
        Order placed. Taking you to your confirmation...
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <div className="space-y-3 rounded-lg border border-dashed p-10 text-center">
        <h2 className="text-lg font-semibold">Your cart is empty</h2>
        <p className="text-muted-foreground">
          Add some products before you check out.
        </p>
        <Button asChild>
          <Link href="/products">Continue shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/cart"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand"
      >
        <ArrowLeft className="size-4" />
        Back to cart
      </Link>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="grid gap-8 lg:grid-cols-[1fr_24rem]"
      >
        {/* Delivery details */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Delivery information</h2>
          <FormField
            id="fullName"
            label="Full name"
            autoComplete="name"
            value={values.fullName}
            onChange={setField("fullName")}
            error={errors.fullName}
          />
          <FormField
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={setField("email")}
            error={errors.email}
          />
          <FormField
            id="phone"
            label="Phone number"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={values.phone}
            onChange={setField("phone")}
            error={errors.phone}
          />
          <FormField
            id="address"
            label="Delivery address"
            autoComplete="street-address"
            value={values.address}
            onChange={setField("address")}
            error={errors.address}
          />
          <FormField
            id="city"
            label="City"
            autoComplete="address-level2"
            value={values.city}
            onChange={setField("city")}
            error={errors.city}
          />
        </section>

        {/* Order summary */}
        <aside className="h-fit space-y-4 rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Order summary</h2>

          <ul className="divide-y">
            {items.map((item) => (
              <li key={item.productId} className="flex gap-3 py-3">
                <SafeImage
                  src={item.image}
                  alt={item.title}
                  className="size-14 shrink-0 rounded-md object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-medium">
                    {item.title}
                  </p>
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

          <Separator />

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total items</span>
            <span>{totalItems}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Placing order..." : "Place order"}
          </Button>

          <p className="text-xs text-muted-foreground">
            This is a simulated checkout. No payment will be taken and no real
            order will be created.
          </p>
        </aside>
      </form>
    </div>
  );
}