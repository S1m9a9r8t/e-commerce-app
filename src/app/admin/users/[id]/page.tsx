import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AdminUserDetails } from "@/components/admin/admin-user-details";

export const metadata: Metadata = {
  title: "User details",
};

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminUserDetailsPage({ params }: PageProps) {
  const { id: rawId } = await params;
  const id = Number(rawId);

  if (!Number.isInteger(id) || id <= 0) {
    return (
      <div className="space-y-4 rounded-lg border border-dashed p-10 text-center">
        <h1 className="text-2xl font-bold">User not found</h1>
        <p className="text-muted-foreground">
          This is not a valid user ID.
        </p>
        <Button asChild>
          <Link href="/admin/users">Back to users</Link>
        </Button>
      </div>
    );
  }

  return <AdminUserDetails id={id} />;
}