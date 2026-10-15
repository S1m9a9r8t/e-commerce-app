import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RetryButton } from "@/components/shared/retry-button";

interface StatCardProps {
  label: string;
  value: number | null;
  href: string;
  linkLabel: string;
}

export function StatCard({ label, value, href, linkLabel }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        {value === null ? (
          <CardTitle className="text-xl text-muted-foreground">
            Unavailable
          </CardTitle>
        ) : (
          <CardTitle className="text-3xl">{value}</CardTitle>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {value === null && (
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">
              Could not load this number from the API.
            </p>
            <RetryButton />
          </div>
        )}
        <Link href={href} className="text-sm text-brand hover:underline">
          {linkLabel}
        </Link>
      </CardContent>
    </Card>
  );
}

export function StatCardSkeleton({ label }: { label: string }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <Skeleton className="h-9 w-20" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-28" />
      </CardContent>
    </Card>
  );
}