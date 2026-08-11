alter table public.carousel_slides
  add column if not exists overlay_image_id uuid references public.images(id),
  add column if not exists overlay_position text not null default 'close',
  add column if not exists overlay_layer text not null default 'front',
  add column if not exists overlay_width text not null default 'medium';