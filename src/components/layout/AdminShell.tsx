"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  ArrowUpDown,
  Users,
  Image as ImageIcon,
  Sliders,
  Grid,
  Frame,
  ChevronDown,
  LogOut,
  FolderOpen,
  Menu,
  X,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

interface NavGroup {
  title: string;
  icon: React.ElementType;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: "Inventario",
    icon: Package,
    items: [
      { href: "/admin/productos", label: "Productos y Stock", icon: Package },
      { href: "/admin/inventario", label: "Movimientos de inventario", icon: ArrowUpDown },
    ],
  },
  {
    title: "Clientes",
    icon: Users,
    items: [{ href: "/admin/clientes", label: "Lista de clientes", icon: Users }],
  },
  {
    title: "Administración Landing",
    icon: FolderOpen,
    items: [
      { href: "/admin/imagenes", label: "Imágenes", icon: ImageIcon },
      { href: "/admin/carrusel", label: "Carrusel principal", icon: Sliders },
      { href: "/admin/categorias-destacadas", label: "Carrusel de categorías", icon: Grid },
      { href: "/admin/marcos", label: "Marcos", icon: Frame },
    ],
  },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Mantiene desplegados los acordeones si la ruta activa coincide
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    NAV_GROUPS.forEach((group) => {
      const hasActiveChild = group.items.some((item) => pathname === item.href);
      initialState[group.title] = hasActiveChild || true;
    });
    return initialState;
  });

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const isVentasActive = pathname === "/admin/ventas";
  const isDashboardActive = pathname === "/admin";

  // Reutilizable: Contenido de la navegación interna
  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* LOGO */}
      <div className="flex h-16 shrink-0 items-center justify-between px-6 font-display text-xl font-bold tracking-tight text-primary border-b border-border md:border-b-0">
        <span>Eddy Admin</span>
        {/* Botón cerrar para vista móvil */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
          aria-label="Cerrar menú"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* ACCIONES PRINCIPALES FIJAS */}
      <div className="shrink-0 space-y-2 border-b border-border p-3">
        {/* Botón Destacado de Ventas */}
        <Link
          href="/admin/ventas"
          onClick={() => setIsMobileOpen(false)}
          className={`flex items-center justify-center gap-2.5 rounded-md px-4 py-2.5 text-sm font-semibold shadow-soft transition-all ${
            isVentasActive
              ? "bg-primary text-primary-foreground shadow-colored ring-2 ring-primary ring-offset-1"
              : "bg-success text-white hover:opacity-90"
          }`}
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Ventas</span>
        </Link>

        {/* Botón Dashboard */}
        <Link
          href="/admin"
          onClick={() => setIsMobileOpen(false)}
          className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            isDashboardActive
              ? "bg-primary-light text-primary font-semibold"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Dashboard</span>
        </Link>
      </div>

      {/* GRUPOS NAVEGABLES */}
      <nav className="flex-1 space-y-4 overflow-y-auto p-3">
        {NAV_GROUPS.map((group) => {
          const isOpen = openGroups[group.title];
          const hasActiveChild = group.items.some((item) => pathname === item.href);
          const GroupIcon = group.icon;

          return (
            <div key={group.title} className="space-y-1">
              <button
                type="button"
                onClick={() => toggleGroup(group.title)}
                className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                  hasActiveChild
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-2">
                  <GroupIcon className="h-3.5 w-3.5" />
                  <span>{group.title}</span>
                </div>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="ml-3 border-l-2 border-border/60 pl-2 space-y-1 my-1">
                  {group.items.map((item) => {
                    const active = pathname === item.href;
                    const ItemIcon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                          active
                            ? "bg-primary text-primary-foreground font-semibold shadow-soft"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <ItemIcon className="h-4 w-4 shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card md:flex md:flex-col">
        <SidebarContent />
      </aside>

      {/* DRAWER / SIDEBAR MÓVIL */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop con oscurecimiento y desenfoque */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Panel Lateral Flotante */}
          <aside className="relative z-50 flex w-72 max-w-[80vw] flex-col bg-card shadow-xl transition-transform">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6">
          <div className="flex items-center gap-3">
            {/* Botón de Hamburguesa Móvil */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
              aria-label="Abrir menú"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Usuario / Email */}
            <div className="flex items-center gap-2.5">
              {user?.user_metadata?.avatar_url && (
                <img
                  src={user.user_metadata.avatar_url}
                  alt={user.user_metadata?.full_name ?? "Perfil"}
                  referrerPolicy="no-referrer"
                  className="h-8 w-8 rounded-full border border-border object-cover"
                />
              )}
              <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate max-w-[140px] sm:max-w-none">
                {user?.email}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <button
              onClick={signOut}
              className="flex items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs sm:text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 bg-background overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}