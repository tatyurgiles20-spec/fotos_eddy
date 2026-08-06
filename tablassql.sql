create table carousel_slides (
  id uuid primary key default gen_random_uuid(),
  carousel_key text not null,        -- 'promo' | 'services' | ... (por si tienes varios carruseles)
  image_id uuid references images(id) on delete cascade,
  alt_text text not null default '', -- SEO: obligatorio, editable en el admin
  title text,
  subtitle text,
  button_text text,
  button_href text,
  button_style text default 'primary', -- 'primary' | 'secondary' | 'outline' | 'ghost'
  position integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Agrega personalización de tipografía y color de texto por slide.
-- Ejecutar DESPUÉS de carousel_slides.sql
 
alter table carousel_slides
  add column if not exists font_family text not null default 'display'
    check (font_family in ('display', 'body', 'accent')),
  add column if not exists text_color text not null default '#ffffff';
 
-- font_family:
--   'display' = Sora (el mismo de tus títulos, negrita/moderna)
--   'body'    = Inter (texto normal, más neutro)
--   'accent'  = Caveat (manuscrita, para algo tipo "hecho a mano")
--
-- text_color: hex libre (ej. '#ffffff'), pensado para el título/subtítulo
-- sobre la foto — el botón sigue usando los estilos predefinidos
-- (primary/secondary/outline/ghost) para no romper el diseño.

-- Ejecutar DESPUÉS de carousel_slides_customization.sql
 
-- 1) font_family pasa a ser opcional: NULL = "automático" (hereda la
--    tipografía por defecto de la página, sin forzar ninguna).
alter table carousel_slides
  drop constraint if exists carousel_slides_font_family_check;
 
alter table carousel_slides
  alter column font_family drop not null,
  alter column font_family drop default;
 
alter table carousel_slides
  add constraint carousel_slides_font_family_check
    check (font_family is null or font_family in ('display', 'body', 'accent'));
 
-- 2) Un solo "text_color" no alcanza: separamos título y subtítulo.
--    Renombramos la columna existente y agregamos la que falta.
--    NULL en cualquiera de las dos = "automático" (hereda el color del tema).
alter table carousel_slides
  rename column text_color to title_color;
 
alter table carousel_slides
  alter column title_color drop not null,
  alter column title_color drop default;
 
alter table carousel_slides
  add column if not exists subtitle_color text;
 
-- 3) Posición del bloque de texto (título/subtítulo/botón) dentro del slide.
alter table carousel_slides
  add column if not exists text_position text not null default 'left'
    check (text_position in ('left', 'center', 'right'));
 


 -- Ejecutar DESPUÉS de carousel_slides_layout.sql

-- 0) FIX ERROR 42703: Agrega la columna updated_at que requiere el trigger set_updated_at()
alter table carousel_slides
  add column if not exists updated_at timestamptz default now();

-- 1) Elimina PRIMERO el constraint viejo para que el UPDATE no falle
alter table carousel_slides
  drop constraint if exists carousel_slides_text_position_check;

-- 2) Migra los valores existentes ('left'/'center'/'right' -> 'bottom-left'/etc.)
update carousel_slides
  set text_position = 'bottom-' || text_position
  where text_position in ('left', 'center', 'right');

-- 3) Agrega el nuevo check con las nuevas variantes ya permitidas
alter table carousel_slides
  add constraint carousel_slides_text_position_check
    check (text_position in (
      'bottom-left', 'bottom-center', 'bottom-right',
      'middle-left', 'middle-center', 'middle-right'
    ));

alter table carousel_slides
  alter column text_position set default 'bottom-left';

-- 4) Subrayado decorativo bajo el título: encendido/apagado por slide
alter table carousel_slides
  add column if not exists show_underline boolean not null default true;