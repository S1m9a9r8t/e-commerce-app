"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getInitials } from "@/components/auth/user-menu";
import { ApiError } from "@/lib/api/client";
import { getUsers } from "@/lib/api/users";
import { cleanImageUrl } from "@/lib/utils";
import type { User } from "@/types";

const PAGE_SIZE = 20;

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function AdminUsersView() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    let cancelled = false;

    setUsers(null);
    setError(null);

    getUsers({ cache: "no-store" })
      .then((data) => {
        if (!cancelled) setUsers(data);
      })
      .catch((e) => {
        if (cancelled) return;
        if (e instanceof ApiError && (e.status === 401 || e.status === 403)) {
          setError("The API does not allow access to the users list.");
        } else {
          setError(e instanceof Error ? e.message : "Something went wrong.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const filtered = useMemo(() => {
    if (!users) return [];
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );
  }, [users, search]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Could not load users</AlertTitle>
        <AlertDescription className="space-y-3">
          <p>{error}</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setAttempt((count) => count + 1)}
          >
            Try again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!users) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-sm" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center">
        <h2 className="text-lg font-semibold">No users found</h2>
        <p className="text-muted-foreground">The API returned no users.</p>
      </div>
    );
  }

  const visible = filtered.slice(0, visibleCount);

  return (
    <div className="space-y-4">
      <div className="max-w-sm space-y-2">
        <Label htmlFor="user-search">Search users</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="user-search"
            type="search"
            placeholder="Name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            className="pl-9"
          />
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {visible.length} of {filtered.length} users
      </p>

      {filtered.length === 0 ? (
        <div className="space-y-3 rounded-lg border border-dashed p-10 text-center">
          <h2 className="text-lg font-semibold">No users match</h2>
          <p className="text-muted-foreground">
            Try a different name or email.
          </p>
          <Button variant="outline" onClick={() => setSearch("")}>
            Clear search
          </Button>
        </div>
      ) : (
        <>
          {/* Table on tablets and desktops */}
          <div className="hidden rounded-lg border md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9">
                          <AvatarImage
                            src={cleanImageUrl(user.avatar)}
                            alt=""
                          />
                          <AvatarFallback>
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="max-w-48 truncate font-medium hover:text-brand"
                        >
                          {user.name}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-64 truncate">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(user.creationAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/admin/users/${user.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Card list on phones */}
          <ul className="space-y-3 md:hidden">
            {visible.map((user) => (
              <li key={user.id} className="space-y-3 rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarImage src={cleanImageUrl(user.avatar)} alt="" />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {user.role}
                  </Badge>
                </div>
                <Button asChild size="sm" variant="outline" className="w-full">
                  <Link href={`/admin/users/${user.id}`}>View</Link>
                </Button>
              </li>
            ))}
          </ul>

          {visibleCount < filtered.length && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              >
                Load more
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}