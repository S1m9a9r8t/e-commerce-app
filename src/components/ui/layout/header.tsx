"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu, MobileAuthButtons } from "@/components/auth/user-menu";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

    const { totalItems, isReady } = useCart();
  const cartCount = isReady ? totalItems : 0;

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:grid md:grid-cols-[1fr_auto_1fr]">
        <div className="flex items-center gap-8 md:contents">
          <Link href="/" className="text-lg font-bold">
            Nexus Store
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-brand ${
                  isActive(link.href) ? "text-brand" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

       <div className="flex items-center gap-1 md:justify-end">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart" aria-label={`Cart, ${cartCount} items`}>
              <span className="relative">
                <ShoppingCart className="size-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </span>
            </Link>
          </Button>

          <ThemeToggle />

                    <div className="hidden md:block">
            <UserMenu />
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Nexus Store</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-md px-3 py-2 text-sm font-medium hover:bg-accent ${
                      isActive(link.href) ? "text-brand" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                                <MobileAuthButtons onNavigate={() => setOpen(false)} />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}