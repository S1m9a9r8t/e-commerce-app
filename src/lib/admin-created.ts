const PRODUCTS_KEY = "nexus-admin-created-products";
const CATEGORIES_KEY = "nexus-admin-created-categories";

function readIds(key: string): number[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((value): value is number => typeof value === "number")
      : [];
  } catch {
    return [];
  }
}

function addId(key: string, id: number) {
  try {
    const ids = readIds(key);
    if (!ids.includes(id)) {
      localStorage.setItem(key, JSON.stringify([...ids, id]));
    }
  } catch {
    // Storage is blocked: the record will be view-only in this browser
  }
}

export function addCreatedProductId(id: number) {
  addId(PRODUCTS_KEY, id);
}

export function isCreatedByMe(id: number) {
  return readIds(PRODUCTS_KEY).includes(id);
}

export function addCreatedCategoryId(id: number) {
  addId(CATEGORIES_KEY, id);
}

export function getCreatedCategoryIds() {
  return readIds(CATEGORIES_KEY);
}

export function isCategoryCreatedByMe(id: number) {
  return readIds(CATEGORIES_KEY).includes(id);
}