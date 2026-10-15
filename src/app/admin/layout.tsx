import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { RequireAdmin } from "@/components/admin/require-admin";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | Admin | Nexus Store",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAdmin>
      <AdminShell>{children}</AdminShell>
    </RequireAdmin>
  );
}