import Link from "next/link";

interface LogoProps {
  href?: string;
  label?: string;
}

export function Logo({ href = "/", label = "Nexus Store" }: LogoProps) {
  return (
    <Link href={href} className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className="relative flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-extrabold text-primary-foreground"
      >
        N
        <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-brand" />
      </span>
      <span className="text-lg font-bold tracking-tight">{label}</span>
    </Link>
  );
}