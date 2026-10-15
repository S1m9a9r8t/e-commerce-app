import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to your Nexus Store account.",
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md py-8">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}