import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CategoryForm } from "@/components/admin/category-form";

export const metadata: Metadata = {
  title: "Add category",
};

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/categories"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand"
      >
        <ArrowLeft className="size-4" />
        All categories
      </Link>

      <h1 className="text-3xl font-bold tracking-tight">Add category</h1>

      <CategoryForm mode="create" />
    </div>
  );
}