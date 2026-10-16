"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FormField } from "@/components/shared/form-field";
import { useAuth } from "@/context/auth-context";
import {
  addCreatedCategoryId,
  isCategoryCreatedByMe,
} from "@/lib/admin-created";
import { ApiError } from "@/lib/api/client";
import { createCategory, updateCategory } from "@/lib/api/categories";
import { cleanImageUrl, isValidHttpUrl } from "@/lib/utils";
import type { Category, CategoryPayload } from "@/types";

interface CategoryFormProps {
  mode: "create" | "edit";
  category?: Category;
}

interface FormErrors {
  name?: string;
  image?: string;
}

export function CategoryForm({ mode, category }: CategoryFormProps) {
  const router = useRouter();
  const { accessToken } = useAuth();

  const [name, setName] = useState(category?.name ?? "");
  const [image, setImage] = useState(cleanImageUrl(category?.image));
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // In edit mode we only allow categories this browser created
  const [owned, setOwned] = useState<boolean | null>(
    mode === "create" ? true : null
  );

  useEffect(() => {
    if (mode === "edit" && category) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- browser storage only exists after the page loads
      setOwned(isCategoryCreatedByMe(category.id));
    }
  }, [mode, category]);

  function validate(): FormErrors {
    const next: FormErrors = {};

    if (name.trim().length < 3) {
      next.name = "Enter a name (at least 3 characters).";
    }

    if (!image.trim()) {
      next.image = "Add an image link.";
    } else if (!isValidHttpUrl(image.trim())) {
      next.image = "Enter a full link that starts with http:// or https://";
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

    const payload: CategoryPayload = {
      name: name.trim(),
      image: image.trim(),
    };

    setIsSubmitting(true);

    try {
      if (mode === "create") {
        const created = await createCategory(payload, accessToken);
        if (!created?.id) {
          throw new Error("The API did not return the new category.");
        }
        addCreatedCategoryId(created.id);
        router.push("/admin/categories?created=1");
      } else if (category) {
        await updateCategory(category.id, payload, accessToken);
        router.push("/admin/categories?updated=1");
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
            : "Could not save the category. Please try again."
        );
      }
      setIsSubmitting(false);
    }
  }

  if (owned === null) {
    return (
      <div className="max-w-xl space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (!owned) {
    return (
      <Alert className="max-w-xl">
        <AlertTitle>This is a shared category</AlertTitle>
        <AlertDescription className="space-y-3">
          <p>
            The API is shared with other students. To protect their data, you
            can only edit categories you created yourself in this browser.
          </p>
          <div className="flex gap-2">
            <Button asChild size="sm">
              <Link href="/admin/categories/new">Add a test category</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/categories">Back to categories</Link>
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-xl space-y-5">
      {submitError && (
        <Alert variant="destructive" role="alert">
          <AlertTitle>
            {mode === "create"
              ? "Could not create the category"
              : "Could not update the category"}
          </AlertTitle>
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <FormField
          id="name"
          label="Name"
          value={name}
          onChange={setName}
          error={errors.name}
        />
        {mode === "create" && (
          <p className="text-xs text-muted-foreground">
            Tip: start the name with TEST so other students know it is a test
            record.
          </p>
        )}
      </div>

      <div className="space-y-1">
        <FormField
          id="image"
          label="Image link"
          type="url"
          value={image}
          onChange={setImage}
          error={errors.image}
        />
        <p className="text-xs text-muted-foreground">
          Use a public image link. You can use https://placehold.co/600x400 for
          testing.
        </p>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : mode === "create"
              ? "Create category"
              : "Save changes"}
        </Button>
        <Button asChild type="button" variant="outline">
          <Link href="/admin/categories">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}

  