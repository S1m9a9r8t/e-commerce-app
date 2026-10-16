"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials } from "@/components/auth/user-menu";
import { ApiError } from "@/lib/api/client";
import { getUser } from "@/lib/api/users";
import { cleanImageUrl } from "@/lib/utils";
import type { User } from "@/types";

type State =
  | { status: "loading" }
  | { status: "ok"; user: User }
  | { status: "not-found" }
  | { status: "error"; message: string };

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const backLink = (
  <Link
    href="/admin/users"
    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand"
  >
    <ArrowLeft className="size-4" />
    All users
  </Link>
);

export function AdminUserDetails({ id }: { id: number }) {
  const [state, setState] = useState<State>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    setState({ status: "loading" });

    getUser(id, { cache: "no-store" })
      .then((user) => {
        if (cancelled) return;
        setState(user?.id ? { status: "ok", user } : { status: "not-found" });
      })
      .catch((e) => {
        if (cancelled) return;
        if (e instanceof ApiError && (e.status === 400 || e.status === 404)) {
          setState({ status: "not-found" });
        } else if (
          e instanceof ApiError &&
          (e.status === 401 || e.status === 403)
        ) {
          setState({
            status: "error",
            message: "The API does not allow access to this user.",
          });
        } else {
          setState({
            status: "error",
            message: e instanceof Error ? e.message : "Something went wrong.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id, attempt]);

  if (state.status === "loading") {
    return (
      <div className="space-y-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-24 w-full max-w-xl" />
        <Skeleton className="h-40 w-full max-w-xl" />
      </div>
    );
  }

  if (state.status === "not-found") {
    return (
      <div className="space-y-4 rounded-lg border border-dashed p-10 text-center">
        <h1 className="text-2xl font-bold">User not found</h1>
        <p className="text-muted-foreground">
          This user does not exist or was removed from the API.
        </p>
        <Button asChild>
          <Link href="/admin/users">Back to users</Link>
        </Button>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <Alert variant="destructive">
        <AlertTitle>Could not load this user</AlertTitle>
        <AlertDescription className="space-y-3">
          <p>{state.message}</p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAttempt((count) => count + 1)}
            >
              Try again
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/users">Back to users</Link>
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  const { user } = state;

  return (
    <div className="space-y-6">
      {backLink}

      <div className="flex items-center gap-4">
        <Avatar className="size-20">
          <AvatarImage src={cleanImageUrl(user.avatar)} alt="" />
          <AvatarFallback className="text-xl">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h1 className="break-words text-2xl font-bold tracking-tight">
            {user.name}
          </h1>
          <Badge variant="secondary" className="mt-1 capitalize">
            {user.role}
          </Badge>
        </div>
      </div>

      <dl className="grid max-w-xl gap-4 rounded-lg border p-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Name</dt>
          <dd className="break-words font-medium">{user.name}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Email</dt>
          <dd className="break-all font-medium">{user.email}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Role</dt>
          <dd className="font-medium capitalize">{user.role}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">User ID</dt>
          <dd className="font-medium">{user.id}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Created</dt>
          <dd className="font-medium">{formatDateTime(user.creationAt)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Last updated</dt>
          <dd className="font-medium">{formatDateTime(user.updatedAt)}</dd>
        </div>
      </dl>
    </div>
  );
}