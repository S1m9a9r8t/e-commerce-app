export { cn } from "cn"
export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export function cleanImageUrl(url: string | undefined) {
  if (!url) return "";
  return url.replace(/[\[\]"]/g, "").trim();
}
