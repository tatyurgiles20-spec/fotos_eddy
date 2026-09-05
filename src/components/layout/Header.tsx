"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const NAV_LINKS = [
  // { href: "#nosotros", label: "Nosotros" },
  { href: "/servicios", label: "Servicios" },
  { href: "/galeria", label: "Galería" },
  { href: "/productos", label: "Productos" },
  { href: "/marcos", label: "Marcos" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 shadow-soft backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center transition-transform duration-300 hover:scale-105">
          {/* Logo full color — modo claro */}
          <Image
            src="/logo-nova-print.png"
            alt="Nova Print"
            width={180}
            height={50}
            priority
            className="h-11 sm:h-12 w-auto object-contain dark:hidden"
          />
          {/* Logo blanco/contorno — modo oscuro */}
          <Image
            src="/logo-nova-print-white.png"
            alt="Nova Print"
            width={180}
            height={50}
            priority
            className="hidden h-11 sm:h-12 w-auto object-contain dark:block"
          />
        </Link>

        {/* Navegación Desktop */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="btn group relative text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          {/* Botón Hamburguesa (Móvil) */}
          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
            aria-label="Abrir menú"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Menú Desplegable Móvil */}
      {isOpen && (
        <nav className="border-b border-border bg-background px-6 pb-6 pt-2 md:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setIsOpen(false)} // Cierra el menú al hacer clic en un enlace
                  className="btn block rounded-lg px-3 py-2.5 text-base text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}