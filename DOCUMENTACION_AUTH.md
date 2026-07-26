# Guía de Configuración: Autenticación de Google con Supabase y Next.js

Esta guía documenta paso a paso el procedimiento para obtener las credenciales de Google Cloud Console, configurar el proveedor de autenticación en Supabase y validar la integración en una aplicación con Next.js.

---

## 1. Configuración en Google Cloud Console

Para habilitar la autenticación con Google y el acceso a las APIs requeridas (como Google Drive), es necesario crear un proyecto y generar las credenciales de OAuth 2.0.

### Pasos:

1. **Crear o seleccionar un proyecto:**
   - Ve a [Google Cloud Console](https://console.cloud.google.com/).
   - En la barra superior, selecciona tu proyecto actual o crea uno nuevo.

2. **Habilitar las APIs necesarias:**
   - Navega a **APIs y servicios** > **Biblioteca**.
   - Busca **Google Drive API** (si tu app interactúa con Drive) y haz clic en **Habilitar**.

3. **Configurar la Pantalla de consentimiento de OAuth:**
   - Ve a **APIs y servicios** > **Pantalla de consentimiento de OAuth**.
   - Selecciona el tipo de usuario (**External / Externo** recomendado para pruebas globales).
   - Llena la información básica requerida (Nombre de la aplicación, correo de soporte y contacto).
   - Guarda los cambios.

4. **Crear las Credenciales de OAuth 2.0:**
   - Ve a **APIs y servicios** > **Credenciales**.
   - Haz clic en **+ Crear credenciales** > **ID de cliente de OAuth**.
   - Selecciona **Aplicación web** como tipo de aplicación.
   - Configura las secciones correspondientes:
     - **Orígenes autorizados de JavaScript:**
       - `http://localhost:3000` (desarrollo local)
       - `https://tu-dominio.com` (producción)
     - **URIs de redirección autorizados:**
       - Agrega la URL de Callback que provee Supabase (ver Sección 2).
   - Haz clic en **Crear**.
   - Guarda tu **ID de cliente** (`GOOGLE_CLIENT_ID`) y tu **Secreto de cliente** (`GOOGLE_CLIENT_SECRET`).

---

## 2. Configuración en el Panel de Supabase

Supabase actúa como el gestor de sesiones y autenticación OAuth en el proyecto.

### Pasos:

1. Ve a tu panel en [Supabase Dashboard](https://supabase.com/dashboard) e ingresa a tu proyecto.
2. En el menú lateral, navega a **Authentication** > **Configuration** > **Sign In / Providers**.
3. Busca **Google** en la lista y haz clic para desplegar las opciones.
4. Cambia el estado a **Enabled**.
5. Copia la **Callback URL (for OAuth)** que genera Supabase (ejemplo: `https://<tu-proyecto>.supabase.co/auth/v1/callback`).
   > **Importante:** Esta es la URL que debes pegar en Google Cloud Console en la sección de **URIs de redirección autorizados**.
6. Introduce las credenciales obtenidas de Google:
   - **Client ID:** Tu `GOOGLE_CLIENT_ID`.
   - **Client Secret:** Tu `GOOGLE_CLIENT_SECRET`.
7. Haz clic en **Save** para aplicar los cambios.

---

## 3. Configuración de Variables de Entorno (`.env.local`)

En la raíz de tu proyecto Next.js, crea o edita el archivo `.env.local` con las siguientes claves:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<tu-proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_publica

# Google OAuth & Drive Credentials
GOOGLE_CLIENT_ID=tu_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu_google_client_secret
ADMIN_EMAIL=tu_correo_admin@gmail.com
DRIVE_FOLDER_ID=id_de_tu_carpeta_en_google_drive