"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/auth-context";

const DEMO_MODE = process.env.NEXT_PUBLIC_ADMIN_DEMO_MODE === "true";

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [status, pathname, router]);

  // Checking the login, or redirecting a guest
  if (status !== "authenticated" || !user) {
    return (
      <div className="space-y-4 p-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  const isAdmin = user.role === "admin";

  if (!isAdmin && !DEMO_MODE) {
    return (
      <div className="mx-auto max-w-md space-y-4 p-8 text-center">
        <h1 className="text-2xl font-bold">Access denied</h1>
        <p className="text-muted-foreground">
          Your account does not have the admin role, so you cannot open the
          dashboard.
        </p>
        <Button asChild>
          <Link href="/">Back to store</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      {!isAdmin && (
        <div
          role="note"
          className="border-b bg-muted px-4 py-2 text-center text-sm"
        >
          <strong>Development-only access.</strong> This account is not an
          admin. The dashboard is open to any logged-in user in this demo. This
          is not real authorization.
        </div>
      )}
      {children}
    </>
  );
}