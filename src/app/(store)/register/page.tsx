import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a Nexus Store account.",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md py-8">
      <Suspense>
        <RegisterForm />
      </Suspense>
    </div>
  );
}