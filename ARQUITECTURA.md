# Proyecto Imágenes Eddy

Landing pública + panel de administración mono-usuario para gestionar el contenido visual del sitio. Las imágenes se suben a Google Drive; su metadata, organización (álbumes/secciones) y la lista de administradores viven en Supabase.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript, SSR) |
| Estilos | Tailwind CSS v4 (config CSS-first, sin `tailwind.config.ts`) |
| Tipografía | `Sora` (display) + `Inter` (body), vía `next/font/google` |
| Tema claro/oscuro | `next-themes` |
| Auth + Base de datos | Supabase (Auth con Google OAuth, Postgres) |
| Almacenamiento de imágenes | Google Drive (API REST, server-only), servidas por link directo (sin proxy) |
| Despliegue | Cloudflare Workers, vía `@opennextjs/cloudflare` |

## Variables de entorno

`.env.local` (desarrollo) — también deben configurarse como Variables/Secrets en Cloudflare para producción:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
DRIVE_FOLDER_ID=
```

> `NEXT_PUBLIC_*` se incrusta en el bundle del navegador **en el momento del build** (no en runtime) — por eso siempre deben estar presentes cuando corres `next build`, ya sea local o en el pipeline de build.
>
> `SUPABASE_SERVICE_ROLE_KEY` nunca lleva `NEXT_PUBLIC_` — salta las políticas RLS y solo se usa server-side (rutas API, `lib/google/drive.ts`).
>
> La lista de administradores **no se maneja por variable de entorno** — se movió a una tabla en Supabase (ver Autenticación) porque las variables de entorno agregadas manualmente desde el dashboard de Cloudflare no se aplicaban de forma confiable en cada deploy.

## Árbol del proyecto

```
proyecto-imagenes-eddy/
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx                  # fonts, <Providers>
│  │  ├─ providers.tsx               # ThemeProvider (next-themes) + ColorThemeProvider
│  │  ├─ page.tsx                    # "/" → <LandingView />
│  │  ├─ globals.css                 # tokens de tema (Tailwind v4 @theme)
│  │  │
│  │  ├─ login/
│  │  │  └─ page.tsx                 # → <LoginView />
│  │  │
│  │  ├─ auth/
│  │  │  └─ callback/
│  │  │     └─ route.ts              # intercambia el code de Google, guarda refresh_token de Drive
│  │  │
│  │  ├─ galeria/
│  │  │  ├─ page.tsx                 # → <GalleryView />  (grid de álbumes)
│  │  │  └─ [slug]/
│  │  │     └─ page.tsx              # → <AlbumView slug />  (imágenes de un álbum)
│  │  │
│  │  ├─ admin/
│  │  │  ├─ layout.tsx               # <AuthGuard><AdminShell>
│  │  │  ├─ page.tsx                 # → <AdminDashboardView />
│  │  │  └─ imagenes/
│  │  │     └─ page.tsx              # → <ImagesManagerView />
│  │  │
│  │  └─ api/
│  │     ├─ albums/
│  │     │  └─ route.ts              # GET (list) / POST (crea álbum + carpeta en Drive)
│  │     ├─ images/
│  │     │  ├─ route.ts              # GET (list por álbum) / POST (sube a Drive + guarda metadata)
│  │     │  └─ [id]/route.ts         # DELETE (borra de Drive + Supabase)
│  │     └─ sections/
│  │        └─ route.ts              # GET (list de secciones normalizadas)
│  │
│  ├─ features/
│  │  ├─ landing/
│  │  │  ├─ views/LandingView.tsx    # Server Component: fetch de destacadas + hero
│  │  │  ├─ api/get-featured-images.ts
│  │  │  └─ components/Hero.tsx, FeaturedGallery.tsx
│  │  │
│  │  ├─ gallery/
│  │  │  ├─ views/GalleryView.tsx, AlbumView.tsx
│  │  │  ├─ api/get-albums.ts, get-album-with-images.ts
│  │  │  └─ components/AlbumCard.tsx
│  │  │
│  │  ├─ auth/
│  │  │  ├─ views/LoginView.tsx
│  │  │  ├─ components/GoogleSignInButton.tsx   # pide scope drive.file + offline/consent
│  │  │  ├─ hooks/useAuth.ts         # sesión Supabase (usuario, signOut)
│  │  │  └─ guards/AuthGuard.tsx     # protección UX en cliente (loading/redirect)
│  │  │
│  │  ├─ admin/
│  │  │  ├─ dashboard/views/AdminDashboardView.tsx
│  │  │  └─ images/
│  │  │     ├─ views/ImagesManagerView.tsx
│  │  │     ├─ components/ImageUploader.tsx, ImageGrid.tsx
│  │  │     └─ hooks/useAlbums.ts, useImages.ts, useSections.ts
│  │  │
│  │  └─ theme/
│  │     ├─ hooks/useColorTheme.tsx        # contexto del acento de marca (data-theme)
│  │     └─ components/ColorThemeSwitcher.tsx  # TEMPORAL — selector de los 6 colores
│  │
│  ├─ lib/
│  │  ├─ supabase/
│  │  │  ├─ client.ts                # createBrowserClient (anon key, sujeto a RLS)
│  │  │  ├─ server.ts                # createServerClient (sesión del usuario, sujeto a RLS)
│  │  │  ├─ admin.ts                 # createAdminClient (service role key, salta RLS — server-only)
│  │  │  └─ middleware.ts            # updateSession: refresca sesión + protege /admin y /api/*
│  │  ├─ auth/
│  │  │  └─ require-admin.ts         # helper para validar admin dentro de las rutas API
│  │  └─ google/
│  │     └─ drive.ts                 # server-only: token refresh, createDriveFolder, upload, delete
│  │
│  ├─ components/
│  │  ├─ ui/                         # Button, Input, Modal... (por construir)
│  │  └─ layout/
│  │     ├─ Header.tsx
│  │     ├─ Footer.tsx
│  │     ├─ SocialFloatingBar.tsx    # íconos flotantes (WhatsApp/Instagram/Facebook/TikTok)
│  │     ├─ ThemeToggle.tsx          # switch claro/oscuro
│  │     └─ AdminShell.tsx           # sidebar/topbar del admin (incluye avatar de Google)
│  │
│  └─ types/
│     ├─ image.ts                    # Album, ImageItem, Section
│     └─ auth.ts
│
├─ middleware.ts                     # protección real de /admin y /api/* (corre en servidor)
├─ wrangler.jsonc                    # config de Cloudflare Workers (ver Despliegue)
├─ next.config.js
├─ .env.local
└─ package.json
```

## Regla de arquitectura

Las rutas dentro de `src/app/` son **"tontas"**: solo componen una `View` importada desde `features/` (pueden ser `async` si la vista hace fetch de datos, pero el fetch en sí vive en `features/<dominio>/api/`, no en el archivo de ruta). Toda la lógica de negocio (hooks, llamadas a Supabase/Drive, componentes de UI específicos de una funcionalidad) vive en `features/<dominio>/`. `components/` es solo UI compartida sin lógica de negocio, y `lib/` son los clientes/wrappers de servicios externos.

## Modelo de datos (Supabase)

```sql
create table albums (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  drive_folder_id text not null,   -- cada álbum tiene su propia carpeta en Drive
  sort_order int default 0,
  created_at timestamptz default now()
);

create table images (
  id uuid primary key default gen_random_uuid(),
  drive_file_id text unique not null,
  album_id uuid not null references albums(id) on delete cascade,  -- toda imagen pertenece a un álbum
  direct_url text not null,          -- lh3.googleusercontent.com — no pasa por el servidor
  alt_text text,
  width int,
  height int,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table sections (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,          -- ej: 'home_destacadas'
  name text not null,
  created_at timestamptz default now()
);

create table image_sections (
  image_id uuid references images(id) on delete cascade,
  section_id uuid references sections(id) on delete cascade,
  sort_order int default 0,
  primary key (image_id, section_id)
);

create table drive_credentials (
  id int primary key default 1,
  refresh_token text not null,
  updated_at timestamptz default now(),
  constraint singleton check (id = 1)
);

alter table images enable row level security;
alter table albums enable row level security;
alter table sections enable row level security;
alter table image_sections enable row level security;
alter table drive_credentials enable row level security;

-- Lectura pública (la landing/galería leen directo con la anon key)
create policy "lectura pública de álbumes" on albums for select using (true);
create policy "lectura pública de imágenes" on images for select using (true);
create policy "lectura pública de secciones" on sections for select using (true);
create policy "lectura pública de asignaciones" on image_sections for select using (true);
-- drive_credentials NO lleva ninguna política — solo accesible con la service role key
```

Una imagen **siempre** pertenece a un álbum (organización de origen, también usada en `/galeria`), y puede además aparecer en **cero o más secciones** vía `image_sections` (dónde se muestra, ej. destacadas del home). Nueva sección = un `insert` en `sections`, sin cambios de esquema ni de código.

## Cómo se sirven las imágenes

Decisión clave: **nunca pasan por el servidor de la app** (evita que el costo se dispare con tráfico alto). Al subir una imagen, el backend:

1. Sube el archivo a la carpeta de Drive del álbum correspondiente.
2. Le da permiso `"cualquiera con el link puede ver"` (seguro porque el scope `drive.file` solo afecta archivos creados por esta app, nunca el resto del Drive del admin).
3. Genera y guarda en `images.direct_url` un link con el patrón:
   ```
   https://lh3.googleusercontent.com/d/{DRIVE_FILE_ID}=w1600
   ```
   (la CDN de imágenes de Google, no el link de descarga de Drive — aguanta tráfico mucho mejor).

La landing y `/galeria` solo leen `direct_url` desde Supabase — cero llamadas a Drive en tiempo real para el visitante.

## Autenticación y autorización

- **Login**: Google OAuth a través de Supabase Auth. Mono-usuario administrador — no hay registro ni multi-tenant. El login pide, además de `email`/`profile`, el scope `https://www.googleapis.com/auth/drive.file` con `access_type: "offline"` y `prompt: "consent"`, para que Google entregue un `refresh_token` reutilizable (no solo un access token de 1 hora).
- **Callback** (`src/app/auth/callback/route.ts`): intercambia el `code` por sesión, y si Supabase devuelve `session.provider_refresh_token`, lo guarda en `drive_credentials` **usando el cliente de service role** (`createAdminClient()`) — el cliente de sesión normal no puede escribir ahí porque la tabla no tiene políticas RLS.
- **Autorización real (quién puede entrar a `/admin` y a las rutas `/api/*`)**: tabla `admins` en Supabase.

  ```sql
  create table admins (
    id uuid primary key default gen_random_uuid(),
    email text unique not null,
    created_at timestamptz default now()
  );

  alter table admins enable row level security;

  create policy "usuarios pueden ver su propia fila de admin"
  on admins for select
  using (email = (auth.jwt() ->> 'email'));
  ```

  `middleware.ts` consulta esta tabla en cada request a `/admin/*` y `/api/*`. Agregar o quitar administradores es editar esta tabla — no requiere redeploy. Las rutas API además revalidan con `requireAdmin()` (`src/lib/auth/require-admin.ts`) antes de escribir nada.

- **`AuthGuard`** (cliente): solo evita parpadeo de contenido mientras carga la sesión; la protección real ocurre en el middleware, en servidor.
- **Avatar en el admin**: `user.user_metadata.avatar_url` (viene gratis del login de Google) se muestra en `AdminShell` con `<img>` normal (no `next/image`, para no tener que registrar el dominio de Google) y `referrerPolicy="no-referrer"` para que no se rompa la carga.

### Renovación de tokens de Drive (`lib/google/drive.ts`)

Cada llamada a Drive (`createDriveFolder`, `uploadImageToDrive`, `deleteImageFromDrive`) pide un access token fresco on-demand:

1. Lee el `refresh_token` de `drive_credentials` — **con `createAdminClient()`**, nunca con el cliente de sesión normal (la tabla no tiene políticas de lectura, así que el cliente normal siempre devolvería vacío aunque la fila exista).
2. Lo intercambia por un access token de 1h contra `https://oauth2.googleapis.com/token`.
3. Usa ese access token en la llamada a la Drive API.

Si `drive_credentials` está vacía o el refresh token se invalida, hay que: revocar el acceso de la app en https://myaccount.google.com/permissions, cerrar sesión en el admin, y volver a loguearse (con `prompt: "consent"` ya configurado, Google vuelve a mostrar la pantalla completa y reemite el refresh token).

### Configuración externa necesaria

- **Google Cloud Console → Credenciales OAuth → Authorized redirect URIs**: únicamente
  `https://<proyecto>.supabase.co/auth/v1/callback` (nunca el dominio de la app).
- **Supabase → Authentication → URL Configuration**:
  - Site URL: dominio de producción
  - Redirect URLs: `https://<dominio-produccion>/auth/callback` y `http://localhost:3000/auth/callback`

## Sistema de temas

- **Modo claro/oscuro**: clase `.dark` en `<html>`, manejado por `next-themes`.
- **Color de marca** (independiente del modo claro/oscuro): atributo `data-theme` en `<html>`, manejado por `ColorThemeProvider` (persistido en `localStorage`). Colores candidatos, uno se elegirá como definitivo:

  | Tema | Hex |
  |---|---|
  | navy (Medianoche) | `#112140` |
  | cyan (Cielo) | `#00AEEF` |
  | magenta (Fucsia) | `#E81E83` |
  | amber (Ámbar) | `#FFC107` |
  | orange (Naranja) | `#EB6100` |
  | carbon (Carbón) | `#101010` |

- `ColorThemeSwitcher` es **temporal** — se elimina de `providers.tsx` en cuanto se defina el color final, dejando ese único tema + su modo oscuro.

## Despliegue (Cloudflare Workers vía OpenNext)

```bash
npm run deploy    # = opennextjs-cloudflare build && opennextjs-cloudflare deploy
```

### Notas importantes

- **`keep_names: false`** en `wrangler.jsonc` es necesario — sin esto, `next-themes` produce un error en runtime (`__name is not defined`) causado por cómo esbuild procesa su script de inicialización. Requiere Wrangler `>= 4.13.0`.
- **Autenticación de Wrangler**: el login por OAuth en el navegador puede fallar con `request_forbidden` / CSRF. Alternativa confiable: generar un API Token en Cloudflare (plantilla "Edit Cloudflare Workers") y exportarlo como `CLOUDFLARE_API_TOKEN` antes de desplegar.
- **Variables de entorno server-only** (`SUPABASE_SERVICE_ROLE_KEY`, `GOOGLE_CLIENT_SECRET`, etc.): ponerlas en `wrangler.jsonc` bajo `"vars"` es más confiable que agregarlas manualmente desde el dashboard de Cloudflare, que puede no aplicarlas en cada deploy.
- **Windows**: OpenNext advierte que no es 100% compatible con Windows (recomienda WSL), aunque en la práctica ha funcionado para este proyecto.
- El **build local** (`next build`) es el que incrusta las variables `NEXT_PUBLIC_*` — deben estar en `.env.local` al momento de correr `npm run deploy` desde tu máquina.

## Próximos pasos

1. Completar la **landing** final (secciones más allá del hero + galería destacada).
2. Elegir el **color de marca definitivo** y eliminar `ColorThemeSwitcher`.
3. UI en el admin para reordenar imágenes/álbumes y editar a qué secciones pertenece una imagen ya subida (hoy solo se asigna al momento de subirla).