create table public.frames (
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

create trigger frames_set_updated_at
  before update on public.frames
  for each row execute function public.set_updated_at();

alter table public.frames enable row level security;

create policy "public_read_active_frames" on public.frames
  for select using (is_active = true);

create policy "admin_full_access_frames" on public.frames
  for all using (auth.uid() in (select admins.id from admins))
  with check (auth.uid() in (select admins.id from admins));

-- Tabla genérica para IDs de carpetas de Drive de un solo propósito
create table public.drive_folders (
  key text primary key,
  folder_id text not null,
  created_at timestamptz not null default now()
);

alter table public.drive_folders enable row level security;
-- sin políticas: solo se accede con el service role (createAdminClient), nunca desde el cliente