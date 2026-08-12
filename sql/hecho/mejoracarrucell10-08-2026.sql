alter table public.carousel_slides
  add column if not exists background_color text,
  add column if not exists text_background_color text,
  add column if not exists title_gradient text,
  add column if not exists subtitle_gradient text;