alter table public.carousel_slides
  add column if not exists image_position text not null default 'right' check (image_position in ('left', 'right'));