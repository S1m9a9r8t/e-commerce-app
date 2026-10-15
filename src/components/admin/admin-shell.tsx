"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/layout/theme-toggle";
import { AdminNav } from "./admin-nav";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex-1 md:grid md:grid-cols-[15rem_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen flex-col border-r p-4 md:flex">
        <Link href="/admin" className="mb-6 px-3 text-lg font-bold">
          Nexus Admin
        </Link>
        <div className="min-h-0 flex-1">
          <AdminNav />
        </div>
      </aside>

      <div className="min-w-0">
        <header className="flex h-14 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            {/* Mobile drawer */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open admin menu"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <SheetHeader>
                  <SheetTitle>Nexus Admin</SheetTitle>
                </SheetHeader>
                <div className="min-h-0 flex-1 px-4 pb-4">
                  <AdminNav onNavigate={() => setOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
            <span className="font-semibold md:hidden">Nexus Admin</span>
          </div>
          <ThemeToggle />
        </header>

        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}