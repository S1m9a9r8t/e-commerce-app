import { apiFetch } from "./client";
import type { Product, ProductPayload } from "@/types";

export interface ProductFilters {
  offset?: number;
  limit?: number;
  title?: string;
  categoryId?: number;
  price_min?: number;
  price_max?: number;
}

function authHeaders(token?: string | null): Record<string, string> | undefined {
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

export function getProducts(
  filters: ProductFilters = {},
  options?: RequestInit
) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });
  const query = params.toString();
  return apiFetch<Product[]>(`/products${query ? `?${query}` : ""}`, options);
}

export function getProduct(id: number, options?: RequestInit) {
  return apiFetch<Product>(`/products/${id}`, options);
}

export function getProductBySlug(slug: string) {
  return apiFetch<Product>(`/products/slug/${slug}`);
}

export function getRelatedProducts(id: number) {
  return apiFetch<Product[]>(`/products/${id}/related`);
}

export function createProduct(payload: ProductPayload, token?: string | null) {
  return apiFetch<Product>("/products", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: authHeaders(token),
  });
}

export function updateProduct(
  id: number,
  payload: ProductPayload,
  token?: string | null
) {
  return apiFetch<Product>(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: authHeaders(token),
  });
}