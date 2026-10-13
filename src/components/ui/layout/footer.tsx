import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} Nexus Store. Demo project powered by the
          EscuelaJS API. Checkout is simulated.
        </p>
        <nav className="flex gap-4">
          <Link href="/" className="hover:text-brand">
            Home
          </Link>
          <Link href="/products" className="hover:text-brand">
            Products
          </Link>
          <Link href="/categories" className="hover:text-brand">
            Categories
          </Link>
        </nav>
      </div>
    </footer>
  );
}