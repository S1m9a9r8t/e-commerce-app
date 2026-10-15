"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Package,
  Store,
  Tag,
  Users,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/users", label: "Users", icon: Users },
];

const itemClass =
  "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent";

export function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  function isActive(href: string) {
    return href === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(href);
  }

  function handleLogout() {
    logout();
    onNavigate?.();
    router.push("/");
  }

  return (
    <nav aria-label="Admin" className="flex h-full flex-col gap-1">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={onNavigate}
          aria-current={isActive(href) ? "page" : undefined}
          className={`${itemClass} ${
            isActive(href) ? "bg-accent text-brand" : "text-muted-foreground"
          }`}
        >
          <Icon className="size-4" />
          {label}
        </Link>
      ))}

      <div className="mt-auto space-y-1 border-t pt-3">
        <Link
          href="/"
          onClick={onNavigate}
          className={`${itemClass} text-muted-foreground`}
        >
          <Store className="size-4" />
          Back to Store
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className={`${itemClass} text-muted-foreground`}
        >
          <LogOut className="size-4" />
          Log out
        </button>
      </div>
    </nav>
  );
}