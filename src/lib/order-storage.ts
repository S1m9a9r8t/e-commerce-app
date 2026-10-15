import type { SimulatedOrder } from "@/types";

const STORAGE_KEY = "nexus-last-order";

export function saveLastOrder(order: SimulatedOrder) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(order));
  } catch {
    // Storage is blocked: the success page will show a fallback message
  }
}

export function loadLastOrder(): SimulatedOrder | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SimulatedOrder;
    return Array.isArray(parsed?.items) ? parsed : null;
  } catch {
    return null;
  }
}