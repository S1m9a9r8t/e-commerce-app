import type { Metadata } from "next";
import { ProfileView } from "@/components/auth/profile-view";
import { RequireAuth } from "@/components/auth/require-auth";

export const metadata: Metadata = {
  title: "Profile",
  description: "View your account details.",
};

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
      <RequireAuth>
        <ProfileView />
      </RequireAuth>
    </div>
  );
}