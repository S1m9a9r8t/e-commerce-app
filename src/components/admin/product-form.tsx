"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/shared/form-field";
import { useAuth } from "@/context/auth-context";
import { addCreatedProductId, isCreatedByMe } from "@/lib/admin-created";
import { ApiError } from "@/lib/api/client";
import { createProduct, updateProduct } from "@/lib/api/products";
import { cleanImageUrl } from "@/lib/utils";
import type { Category, Product, ProductPayload } from "@/types";

interface ProductFormProps {
  mode: "create" | "edit";
  categories: Category[];
  product?: Product;
}

interface FormErrors {
  title?: string;
  price?: string;
  description?: string;
  categoryId?: string;
  images?: string;
}

function parseImages(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function ProductForm({ mode, categories, product }: ProductFormProps) {
  const router = useRouter();
  const { accessToken } = useAuth();

  const [title, setTitle] = useState(product?.title ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [categoryId, setCategoryId] = useState(
    product?.category?.id ? String(product.category.id) : ""
  );
  const [imagesText, setImagesText] = useState(
    (product?.images ?? []).map(cleanImageUrl).filter(Boolean).join("\n")
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // In edit mode we only allow products this browser created
  const [owned, setOwned] = useState<boolean | null>(
    mode === "create" ? true : null
  );

  useEffect(() => {
    if (mode === "edit" && product) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- browser storage only exists after the page loads
      setOwned(isCreatedByMe(product.id));
    }
  }, [mode, product]);

  function validate(): FormErrors {
    const next: FormErrors = {};

    if (title.trim().length < 3) {
      next.title = "Enter a title (at least 3 characters).";
    }

    const priceNumber = Number(price);
    if (
      price.trim() === "" ||
      !Number.isInteger(priceNumber) ||
      priceNumber <= 0
    ) {
      next.price = "Enter a whole number greater than 0.";
    }

    if (description.trim().length < 10) {
      next.description = "Enter a description (at least 10 characters).";
    }

    if (!categoryId) {
      next.categoryId = "Choose a category.";
    }

    const urls = parseImages(imagesText);
    if (urls.length === 0) {
      next.images = "Add at least one image link.";
    } else if (urls.some((url) => !isValidUrl(url))) {
      next.images =
        "Every line must be a full link that starts with http:// or https://";
    }

    return next;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setSubmitError(null);
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const payload: ProductPayload = {
      title: title.trim(),
      price: Number(price),
      description: description.trim(),
      categoryId: Number(categoryId),
      images: parseImages(imagesText),
    };

    setIsSubmitting(true);

    try {
      if (mode === "create") {
        const created = await createProduct(payload, accessToken);
        if (!created?.id) {
          throw new Error("The API did not return the new product.");
        }
        addCreatedProductId(created.id);
        router.push(`/admin/products/${created.id}?created=1`);
      } else if (product) {
        await updateProduct(product.id, payload, accessToken);
        router.push(`/admin/products/${product.id}?updated=1`);
      }
    } catch (e) {
      if (e instanceof ApiError && (e.status === 401 || e.status === 403)) {
        setSubmitError(
          "The API refused this request because of permissions. Log in again and retry."
        );
      } else if (e instanceof ApiError) {
        setSubmitError(e.message);
      } else {
        setSubmitError(
          e instanceof Error
            ? e.message
            : "Could not save the product. Please try again."
        );
      }
      setIsSubmitting(false);
    }
  }

  if (owned === null) {
    return (
      <div className="max-w-2xl space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!owned) {
    return (
      <Alert className="max-w-2xl">
        <AlertTitle>This is a shared product</AlertTitle>
        <AlertDescription className="space-y-3">
          <p>
            The API is shared with other students. To protect their data, you
            can only edit products you created yourself in this browser.
          </p>
          <div className="flex gap-2">
            <Button asChild size="sm">
              <Link href="/admin/products/new">Add a test product</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href={`/admin/products/${product?.id ?? ""}`}>
                Back to details
              </Link>
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="max-w-2xl space-y-5"
    >
      {submitError && (
        <Alert variant="destructive" role="alert">
          <AlertTitle>
            {mode === "create"
              ? "Could not create the product"
              : "Could not update the product"}
          </AlertTitle>
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <FormField
          id="title"
          label="Title"
          value={title}
          onChange={setTitle}
          error={errors.title}
        />
        {mode === "create" && (
          <p className="text-xs text-muted-foreground">
            Tip: start the title with TEST so other students know it is a test
            record.
          </p>
        )}
      </div>

      <FormField
        id="price"
        label="Price ($, whole number)"
        type="number"
        inputMode="numeric"
        value={price}
        onChange={setPrice}
        error={errors.price}
      />

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger
            id="category"
            className="w-full"
            aria-invalid={!!errors.categoryId}
          >
            <SelectValue placeholder="Choose a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={String(category.id)}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.categoryId && (
          <p className="text-sm text-destructive">{errors.categoryId}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? "description-error" : undefined}
        />
        {errors.description && (
          <p id="description-error" className="text-sm text-destructive">
            {errors.description}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="images">Image links (one per line)</Label>
        <Textarea
          id="images"
          rows={3}
          placeholder="https://placehold.co/600x400"
          value={imagesText}
          onChange={(e) => setImagesText(e.target.value)}
          aria-invalid={!!errors.images}
          aria-describedby="images-hint"
        />
        <p id="images-hint" className="text-xs text-muted-foreground">
          Use public image links. You can use https://placehold.co/600x400 for
          testing.
        </p>
        {errors.images && (
          <p className="text-sm text-destructive">{errors.images}</p>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : mode === "create"
              ? "Create product"
              : "Save changes"}
        </Button>
        <Button asChild type="button" variant="outline">
          <Link
            href={
              mode === "edit" && product
                ? `/admin/products/${product.id}`
                : "/admin/products"
            }
          >
            Cancel
          </Link>
        </Button>
      </div>
    </form>
  );
}