import { apiFetch } from "./client";
import type { Category, Product } from "@/types";

export function getCategories() {
  return apiFetch<Category[]>("/categories");
}

export function getCategory(id: number) {
  return apiFetch<Category>(`/categories/${id}`);
}

export function getCategoryBySlug(slug: string) {
  return apiFetch<Category>(`/categories/slug/${slug}`);
}

export function getCategoryProducts(id: number) {
  return apiFetch<Product[]>(`/categories/${id}/products`);
}