"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getInitials } from "@/components/auth/user-menu";
import { useAuth } from "@/context/auth-context";
import { cleanImageUrl } from "@/lib/utils";

export function ProfileView() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="flex items-center gap-4">
          <Avatar className="size-20">
            <AvatarImage src={cleanImageUrl(user.avatar)} alt="" />
            <AvatarFallback className="text-xl">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold">{user.name}</h2>
            {user.role && (
              <Badge variant="secondary" className="mt-1 capitalize">
                {user.role}
              </Badge>
            )}
          </div>
        </div>

        <Separator />

        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Name</dt>
            <dd className="font-medium">{user.name}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Email</dt>
            <dd className="break-all font-medium">{user.email}</dd>
          </div>
        </dl>

        <Button variant="outline" onClick={handleLogout}>
          Log out
        </Button>
      </CardContent>
    </Card>
  );
}