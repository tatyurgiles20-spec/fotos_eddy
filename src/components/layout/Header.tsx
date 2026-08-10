"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

const NAV_LINKS = [
  { href: "#nosotros", label: "Nosotros" },
  { href: "#servicios", label: "Servicios" },
  { href: "#galeria", label: "Galería" },
  { href: "#productos", label: "Productos" },
  { href: "/marcos", label: "Marcos" },
  { href: "#contacto", label: "Contacto" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

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

        {/* Navegación Desktop */}
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

        <div className="flex items-center gap-4">
          <ThemeToggle />

          {/* Botón Hamburguesa (Móvil) */}
          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground md:hidden"
            aria-label="Abrir menú"
          >
            {isOpen ? (
              // Ícono 'X' cuando está abierto
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Ícono Hamburguesa cuando está cerrado
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Menú Desplegable Móvil */}
      {isOpen && (
        <nav className="border-b border-border bg-background px-6 pb-6 pt-2 md:hidden">
          <ul className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setIsOpen(false)} // Cierra el menú al hacer clic en un enlace
                  className="block text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
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