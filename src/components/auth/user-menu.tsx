"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth-context";
import { cleanImageUrl } from "@/lib/utils";

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U"
  );
}

export function UserMenu() {
  const { user, status, logout } = useAuth();
  const router = useRouter();

  // Keep the space so the header doesn't jump while we check the login
  if (status === "loading") {
    return <div className="size-8" aria-hidden="true" />;
  }

  if (!user) {
    return (
      <Button asChild size="sm">
        <Link href="/login">Log In</Link>
      </Button>
    );
  }

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label="Account menu"
        >
          <Avatar className="size-8">
            <AvatarImage src={cleanImageUrl(user.avatar)} alt="" />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs font-normal text-muted-foreground">
            {user.email}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function MobileAuthButtons({ onNavigate }: { onNavigate: () => void }) {
  const { user, status, logout } = useAuth();

  if (status === "loading") return null;

  if (!user) {
    return (
      <Button asChild className="mt-4">
        <Link href="/login" onClick={onNavigate}>
          Log In
        </Link>
      </Button>
    );
  }

  return (
    <div className="mt-4 space-y-1">
      <p className="truncate px-3 text-xs text-muted-foreground">
        {user.email}
      </p>
      <Link
        href="/profile"
        onClick={onNavigate}
        className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
      >
        Profile
      </Link>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          logout();
          onNavigate();
        }}
      >
        Log out
      </Button>
    </div>
  );
}