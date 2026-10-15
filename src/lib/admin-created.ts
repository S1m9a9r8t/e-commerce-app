const STORAGE_KEY = "nexus-admin-created-products";

function readIds(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((value): value is number => typeof value === "number")
      : [];
  } catch {
    return [];
  }
}

export function addCreatedProductId(id: number) {
  try {
    const ids = readIds();
    if (!ids.includes(id)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids, id]));
    }
  } catch {
    // Storage is blocked: the product will be view-only in this browser
  }
}

export function isCreatedByMe(id: number) {
  return readIds().includes(id);
}