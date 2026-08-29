-- =========================================================
-- ESQUEMA CONSOLIDADO — Proyecto Imágenes Eddy
-- Generado a partir de todos los scripts SQL entregados,
-- fusionando migraciones sucesivas en la definición final
-- de cada tabla/función/trigger.
--
-- Orden: 1) funciones utilitarias  2) tablas  3) vistas
--        4) funciones de negocio  5) triggers  6) RLS
-- =========================================================

-- =========================================================
-- 1. FUNCIONES UTILITARIAS (deben existir antes de los triggers)
-- =========================================================

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Versión final: cubre INSERT, UPDATE y DELETE sobre inventory_movements
-- (la versión original del módulo de productos solo cubría INSERT)
create or replace function public.update_product_stock()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    if NEW.movement_type = 'in' then
      update public.products set stock = stock + NEW.quantity where id = NEW.product_id;
    else
      update public.products set stock = stock - NEW.quantity where id = NEW.product_id;
    end if;
    return NEW;

  elsif TG_OP = 'DELETE' then
    if OLD.movement_type = 'in' then
      update public.products set stock = stock - OLD.quantity where id = OLD.product_id;
    else
      update public.products set stock = stock + OLD.quantity where id = OLD.product_id;
    end if;
    return OLD;

  elsif TG_OP = 'UPDATE' then
    if OLD.movement_type = 'in' then
      update public.products set stock = stock - OLD.quantity where id = OLD.product_id;
    else
      update public.products set stock = stock + OLD.quantity where id = OLD.product_id;
    end if;
    if NEW.movement_type = 'in' then
      update public.products set stock = stock + NEW.quantity where id = NEW.product_id;
    else
      update public.products set stock = stock - NEW.quantity where id = NEW.product_id;
    end if;
    return NEW;
  end if;

  return null;
end;
$$ language plpgsql;

-- =========================================================
-- 2. TABLAS
-- =========================================================

-- ---------- 2.1 Administradores ----------
create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);

-- ---------- 2.2 Galería (álbumes / imágenes / secciones) ----------
create table if not exists public.albums (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  drive_folder_id text not null,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists public.images (
  id uuid primary key default gen_random_uuid(),
  drive_file_id text unique not null,
  album_id uuid not null references public.albums(id) on delete cascade,
  direct_url text not null,
  alt_text text,
  width int,
  height int,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists public.sections (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  name text not null,
  created_at timestamptz default now()
);

create table if not exists public.image_sections (
  image_id uuid references public.images(id) on delete cascade,
  section_id uuid references public.sections(id) on delete cascade,
  sort_order int default 0,
  primary key (image_id, section_id)
);

create table if not exists public.drive_credentials (
  id int primary key default 1,
  refresh_token text not null,
  updated_at timestamptz default now(),
  constraint singleton check (id = 1)
);

-- Tabla genérica clave/valor para IDs de carpetas de Drive de un solo propósito
create table if not exists public.drive_folders (
  key text primary key,
  folder_id text not null,
  created_at timestamptz not null default now()
);

-- ---------- 2.3 Marcos / frames ----------
create table if not exists public.frames (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  drive_file_id text not null,
  direct_url text not null,
  width integer,
  height integer,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

-- ---------- 2.4 Productos / servicios ----------
create table if not exists public.product_categories (
  id uuid not null default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  sort_order integer,
  created_at timestamptz default now(),
  deleted_at timestamptz
);

create table if not exists public.products (
  id uuid not null default gen_random_uuid() primary key,
  category_id uuid references public.product_categories(id),
  name text not null,
  slug text not null unique,
  description text,
  meta_description text,
  type text not null default 'product' check (type in ('product', 'service')),
  sku text,
  purchase_price numeric(10,2),
  sale_price numeric(10,2) not null,
  stock integer not null default 0,
  is_published boolean not null default false,
  sort_order integer,
  created_at timestamptz default now(),
  updated_at timestamptz,
  deleted_at timestamptz
);

create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_published on public.products(is_published) where deleted_at is null;

create table if not exists public.product_images (
  product_id uuid not null references public.products(id) on delete cascade,
  image_id uuid not null references public.images(id) on delete cascade,
  sort_order integer,
  primary key (product_id, image_id)
);

create table if not exists public.category_highlights (
  id uuid not null default gen_random_uuid() primary key,
  category_id uuid not null references public.product_categories(id),
  target_type text not null check (target_type in ('product', 'service')),
  description text,
  image_id uuid references public.images(id),
  is_visible boolean not null default true,
  sort_order integer,
  created_at timestamptz default now()
);

create index if not exists idx_category_highlights_visible on public.category_highlights(is_visible);

-- ---------- 2.5 Clientes / ventas ----------
create table if not exists public.customers (
  id uuid not null default gen_random_uuid() primary key,
  name text not null,
  identification_type text check (identification_type in ('cedula', 'ruc', 'pasaporte')),
  identification text,
  email text,
  phone text,
  address text,
  created_at timestamptz default now(),
  deleted_at timestamptz
);

create unique index if not exists idx_customers_identification
  on public.customers(identification) where identification is not null;

-- discount_type/discount_value ya integrados (migración posterior fusionada aquí)
create table if not exists public.sales (
  id uuid not null default gen_random_uuid() primary key,
  sale_number bigint generated always as identity,
  customer_id uuid references public.customers(id), -- null = "Consumidor Final"
  status text not null default 'completed' check (status in ('completed', 'cancelled')),
  subtotal numeric(10,2) not null default 0,
  discount_total numeric(10,2) not null default 0,
  discount_type text check (discount_type in ('amount', 'percentage')),
  discount_value numeric(10,2) not null default 0,
  tax_total numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  payment_method text not null default 'cash' check (payment_method in ('cash', 'transfer', 'card', 'credit')),
  payment_status text not null default 'paid' check (payment_status in ('paid', 'pending')),
  notes text,
  created_by uuid references public.admins(id),
  created_at timestamptz default now(),
  cancelled_at timestamptz
);

create index if not exists idx_sales_customer on public.sales(customer_id);
create index if not exists idx_sales_created_at on public.sales(created_at);

create table if not exists public.sale_items (
  id uuid not null default gen_random_uuid() primary key,
  sale_id uuid not null references public.sales(id) on delete cascade,
  product_id uuid references public.products(id),
  product_name_snapshot text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null,
  unit_cost numeric(10,2),
  subtotal numeric(10,2) not null,
  discount_type text check (discount_type in ('amount', 'percentage')),
  discount_value numeric(10,2) not null default 0
);

create index if not exists idx_sale_items_sale on public.sale_items(sale_id);
create index if not exists idx_sale_items_product on public.sale_items(product_id);

-- sale_id + updated_at ya integrados (migraciones posteriores fusionadas aquí)
create table if not exists public.inventory_movements (
  id uuid not null default gen_random_uuid() primary key,
  product_id uuid not null references public.products(id) on delete cascade,
  movement_type text not null check (movement_type in ('in', 'out')),
  quantity integer not null check (quantity > 0),
  unit_cost numeric(10,2),
  reason text,
  created_by uuid references public.admins(id),
  sale_id uuid references public.sales(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz
);

create index if not exists idx_inventory_movements_product on public.inventory_movements(product_id);
create index if not exists idx_inventory_movements_sale on public.inventory_movements(sale_id);

-- ---------- 2.6 Carrusel ----------
-- Definición tomada directamente del dump de introspección (ya en producción).
-- image_id/overlay_image_id se infieren como FK a images(id) por convención del
-- resto del proyecto; el dump de columnas no incluye claves foráneas, así que
-- si alguna no aplica, quítala sin problema.
create table if not exists public.carousel_slides (
  id uuid primary key default gen_random_uuid(),
  carousel_key text not null default 'promo',
  image_id uuid not null references public.images(id),
  alt_text text not null default '',
  title text,
  subtitle text,
  button_text text,
  button_href text,
  button_style text not null default 'primary',
  font_family text,
  title_color text,
  subtitle_color text,
  text_position text not null default 'bottom-left',
  show_underline boolean not null default true,
  position integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  background_color text,
  text_background_color text,
  title_gradient text,
  subtitle_gradient text,
  overlay_image_id uuid references public.images(id),
  overlay_position text not null default 'close',
  overlay_layer text not null default 'front',
  overlay_width text not null default 'medium',
  background_gradient text,
  button_gradient text
);

-- =========================================================
-- 3. VISTAS
-- =========================================================

create or replace view public.product_sales_ranking as
select
  p.id as product_id,
  p.type,
  p.is_published,
  p.deleted_at,
  coalesce(sum(m.quantity), 0) as total_sold
from public.products p
left join public.inventory_movements m
  on m.product_id = p.id and m.movement_type = 'out'
group by p.id, p.type, p.is_published, p.deleted_at;

-- =========================================================
-- 4. FUNCIONES DE NEGOCIO
-- =========================================================

-- Se elimina la sobrecarga vieja (6 parámetros, sin descuento) que convivía en
-- la base junto con la versión nueva (8 parámetros, con descuento). Si no se
-- quita, Postgres mantiene ambas firmas de create_sale al mismo tiempo y una
-- llamada desde la app sin discount_type/discount_value puede resolver contra
-- la versión vieja sin avisar.
drop function if exists public.create_sale(uuid, jsonb, text, text, text, uuid);

-- Versión final: incluye descuento por línea y descuento a nivel de venta completa
create or replace function public.create_sale(
  p_customer_id uuid,
  p_items jsonb,
  p_payment_method text default 'cash',
  p_payment_status text default 'paid',
  p_notes text default null,
  p_created_by uuid default null,
  p_discount_type text default null,
  p_discount_value numeric default 0
)
returns uuid as $$
declare
  v_sale_id uuid;
  v_subtotal numeric(10,2) := 0;
  v_items_discount numeric(10,2) := 0;
  v_order_discount numeric(10,2) := 0;
  v_discount_total numeric(10,2) := 0;
  v_item jsonb;
  v_product record;
  v_raw_line numeric(10,2);
  v_line_discount numeric(10,2);
  v_line_net numeric(10,2);
  v_item_discount_type text;
  v_item_discount_value numeric(10,2);
begin
  insert into public.sales (customer_id, payment_method, payment_status, notes, created_by, status)
  values (p_customer_id, p_payment_method, p_payment_status, p_notes, p_created_by, 'completed')
  returning id into v_sale_id;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    select id, name, sale_price, purchase_price, stock into v_product
    from public.products
    where id = (v_item->>'product_id')::uuid;

    if not found then
      raise exception 'Producto % no encontrado', v_item->>'product_id';
    end if;

    v_raw_line := (v_item->>'quantity')::integer
      * coalesce((v_item->>'unit_price')::numeric, v_product.sale_price);

    v_item_discount_type := v_item->>'discount_type';
    v_item_discount_value := coalesce((v_item->>'discount_value')::numeric, 0);

    v_line_discount := case
      when v_item_discount_type = 'percentage' then v_raw_line * v_item_discount_value / 100
      when v_item_discount_type = 'amount' then v_item_discount_value
      else 0
    end;
    v_line_discount := least(v_line_discount, v_raw_line);
    v_line_net := v_raw_line - v_line_discount;

    insert into public.sale_items (
      sale_id, product_id, product_name_snapshot, quantity, unit_price, unit_cost, subtotal,
      discount_type, discount_value
    )
    values (
      v_sale_id,
      v_product.id,
      v_product.name,
      (v_item->>'quantity')::integer,
      coalesce((v_item->>'unit_price')::numeric, v_product.sale_price),
      v_product.purchase_price,
      v_line_net,
      v_item_discount_type,
      v_item_discount_value
    );

    insert into public.inventory_movements (product_id, movement_type, quantity, unit_cost, reason, created_by, sale_id)
    values (
      v_product.id,
      'out',
      (v_item->>'quantity')::integer,
      v_product.purchase_price,
      'Venta',
      p_created_by,
      v_sale_id
    );

    v_subtotal := v_subtotal + v_raw_line;
    v_items_discount := v_items_discount + v_line_discount;
  end loop;

  v_order_discount := case
    when p_discount_type = 'percentage' then (v_subtotal - v_items_discount) * coalesce(p_discount_value, 0) / 100
    when p_discount_type = 'amount' then coalesce(p_discount_value, 0)
    else 0
  end;
  v_order_discount := least(v_order_discount, v_subtotal - v_items_discount);

  v_discount_total := v_items_discount + v_order_discount;

  update public.sales
  set subtotal = v_subtotal,
      discount_total = v_discount_total,
      discount_type = p_discount_type,
      discount_value = coalesce(p_discount_value, 0),
      total = v_subtotal - v_discount_total + tax_total
  where id = v_sale_id;

  return v_sale_id;
end;
$$ language plpgsql;

create or replace function public.cancel_sale(p_sale_id uuid)
returns void as $$
begin
  -- Al borrar los movimientos ligados a esta venta, trg_update_stock
  -- ya revierte el stock automáticamente (no hay que hacerlo a mano)
  delete from public.inventory_movements where sale_id = p_sale_id;

  update public.sales
  set status = 'cancelled', cancelled_at = now()
  where id = p_sale_id;
end;
$$ language plpgsql;

-- =========================================================
-- 5. TRIGGERS
-- =========================================================

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists trg_inventory_movements_updated_at on public.inventory_movements;
create trigger trg_inventory_movements_updated_at
before update on public.inventory_movements
for each row execute function public.set_updated_at();

drop trigger if exists frames_set_updated_at on public.frames;
create trigger frames_set_updated_at
before update on public.frames
for each row execute function public.set_updated_at();

drop trigger if exists trg_update_stock on public.inventory_movements;
create trigger trg_update_stock
after insert or update or delete on public.inventory_movements
for each row execute function public.update_product_stock();

drop trigger if exists carousel_slides_set_updated_at on public.carousel_slides;
create trigger carousel_slides_set_updated_at
before update on public.carousel_slides
for each row execute function public.set_updated_at();

-- =========================================================
-- 6. ROW LEVEL SECURITY
-- =========================================================

-- ---------- admins ----------
alter table public.admins enable row level security;

create policy "usuarios pueden ver su propia fila de admin"
on public.admins for select
using (email = (auth.jwt() ->> 'email'));

-- ---------- galería ----------
alter table public.images enable row level security;
alter table public.albums enable row level security;
alter table public.sections enable row level security;
alter table public.image_sections enable row level security;
alter table public.drive_credentials enable row level security;
alter table public.drive_folders enable row level security;

create policy "lectura pública de álbumes" on public.albums for select using (true);
create policy "lectura pública de imágenes" on public.images for select using (true);
create policy "lectura pública de secciones" on public.sections for select using (true);
create policy "lectura pública de asignaciones" on public.image_sections for select using (true);
-- drive_credentials y drive_folders: sin políticas — solo accesibles con la service role key

-- ---------- frames ----------
alter table public.frames enable row level security;

create policy "public_read_active_frames" on public.frames
  for select using (is_active = true);

create policy "admin_full_access_frames" on public.frames
  for all using (auth.uid() in (select admins.id from public.admins))
  with check (auth.uid() in (select admins.id from public.admins));

-- ---------- carrusel ----------
alter table public.carousel_slides enable row level security;

create policy "carousel_slides_public_read" on public.carousel_slides
  for select using (active = true);

-- Nota: este módulo usa auth.jwt() ->> 'role' = 'admin' en vez del patrón
-- auth.uid() in (select id from admins) usado en el resto de tablas admin.
create policy "carousel_slides_admin_write" on public.carousel_slides
  for all using ((auth.jwt() ->> 'role') = 'admin')
  with check ((auth.jwt() ->> 'role') = 'admin');

-- ---------- productos / servicios ----------
alter table public.product_categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.category_highlights enable row level security;

create policy "public_read_categories" on public.product_categories
  for select using (deleted_at is null);

create policy "public_read_published_products" on public.products
  for select using (is_published = true and deleted_at is null);

create policy "public_read_product_images" on public.product_images
  for select using (
    exists (
      select 1 from public.products p
      where p.id = product_images.product_id
      and p.is_published = true and p.deleted_at is null
    )
  );

create policy "public_read_visible_highlights" on public.category_highlights
  for select using (is_visible = true);

-- inventory_movements NO tiene policy pública: es información interna de costos/stock

create policy "admin_full_access_categories" on public.product_categories
  for all using (auth.uid() in (select id from public.admins))
  with check (auth.uid() in (select id from public.admins));

create policy "admin_full_access_products" on public.products
  for all using (auth.uid() in (select id from public.admins))
  with check (auth.uid() in (select id from public.admins));

create policy "admin_full_access_product_images" on public.product_images
  for all using (auth.uid() in (select id from public.admins))
  with check (auth.uid() in (select id from public.admins));

create policy "admin_full_access_inventory" on public.inventory_movements
  for all using (auth.uid() in (select id from public.admins))
  with check (auth.uid() in (select id from public.admins));

create policy "admin_full_access_highlights" on public.category_highlights
  for all using (auth.uid() in (select id from public.admins))
  with check (auth.uid() in (select id from public.admins));

-- ---------- clientes / ventas ----------
alter table public.customers enable row level security;
alter table public.sales enable row level security;
alter table public.sale_items enable row level security;

create policy "admin_full_access_customers" on public.customers
  for all using (auth.uid() in (select id from public.admins))
  with check (auth.uid() in (select id from public.admins));

create policy "admin_full_access_sales" on public.sales
  for all using (auth.uid() in (select id from public.admins))
  with check (auth.uid() in (select id from public.admins));

create policy "admin_full_access_sale_items" on public.sale_items
  for all using (auth.uid() in (select id from public.admins))
  with check (auth.uid() in (select id from public.admins));

-- =========================================================
-- FIN DEL ESQUEMA CONSOLIDADO
-- =========================================================