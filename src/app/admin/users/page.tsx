import type { Metadata } from "next";
import { AdminUsersView } from "@/components/admin/admin-users-view";

export const metadata: Metadata = {
  title: "Users",
};

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">
          View the accounts registered in the API. Passwords and tokens are
          never shown.
        </p>
      </div>
      <AdminUsersView />
    </div>
  );
}