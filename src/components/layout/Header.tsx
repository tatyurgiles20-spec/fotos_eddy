import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

const NAV_LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#galeria", label: "Galería" },
  { href: "#contacto", label: "Contacto" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center">
          {/* Logo full color — modo claro */}
          <Image
            src="/logo-nova-print.png"
            alt="Nova Print"
            width={140}
            height={40}
            priority
            className="h-9 w-auto dark:hidden"
          />
          {/* Logo blanco/contorno — modo oscuro */}
          <Image
            src="/logo-nova-print-white.png"
            alt="Nova Print"
            width={140}
            height={40}
            priority
            className="hidden h-9 w-auto dark:block"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        
      </div>
    </header>
  );
}