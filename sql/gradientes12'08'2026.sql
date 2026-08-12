alter table public.carousel_slides
  add column if not exists background_gradient text,
  add column if not exists button_gradient text;