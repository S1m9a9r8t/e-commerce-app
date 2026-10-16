import { apiFetch } from "./client";
import type { Category, CategoryPayload, Product } from "@/types";

function authHeaders(token?: string | null): Record<string, string> | undefined {
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

export function getCategories(options?: RequestInit) {
  return apiFetch<Category[]>("/categories", options);
}

export function getCategory(id: number, options?: RequestInit) {
  return apiFetch<Category>(`/categories/${id}`, options);
}

export function getCategoryBySlug(slug: string) {
  return apiFetch<Category>(`/categories/slug/${slug}`);
}

export function getCategoryProducts(id: number) {
  return apiFetch<Product[]>(`/categories/${id}/products`);
}

export function createCategory(
  payload: CategoryPayload,
  token?: string | null
) {
  return apiFetch<Category>("/categories", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: authHeaders(token),
  });
}

export function updateCategory(
  id: number,
  payload: CategoryPayload,
  token?: string | null
) {
  return apiFetch<Category>(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: authHeaders(token),
  });
}