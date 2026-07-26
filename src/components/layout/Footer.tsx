export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground md:flex-row">
        <p>&copy; {new Date().getFullYear()} Eddy. Todos los derechos reservados.</p>
        <div className="flex gap-6">
          <a href="#servicios" className="transition-colors hover:text-foreground">Servicios</a>
          <a href="#galeria" className="transition-colors hover:text-foreground">Galería</a>
          <a href="#contacto" className="transition-colors hover:text-foreground">Contacto</a>
        </div>
      </div>
    </footer>
  );
}