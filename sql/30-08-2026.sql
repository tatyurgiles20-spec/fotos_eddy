alter table public.carousel_slides
  drop constraint if exists carousel_slides_font_family_check;

alter table public.carousel_slides
  add constraint carousel_slides_font_family_check
  check (font_family is null or font_family in (
    'display', 'body', 'accent',
    'poppins', 'montserrat', 'playlist',
    'oswald', 'playfair', 'bebas', 'spacegrotesk', 'merriweather'
  ));