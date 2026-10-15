"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function RetryButton({ label = "Try again" }: { label?: string }) {
  const router = useRouter();

  return (
    <Button size="sm" variant="outline" onClick={() => router.refresh()}>
      {label}
    </Button>
  );
}