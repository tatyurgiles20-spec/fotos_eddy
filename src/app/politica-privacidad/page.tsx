// app/politica-privacidad/page.tsx

export const metadata = {
  title: "Política de Privacidad - NovaPrint",
  description: "Política de privacidad de NovaPrint",
};

const NOMBRE_NEGOCIO = "NovaPrint";
const CORREO_SOPORTE = "novaprintoficial1@gmail.com";
const URL_SITIO = "https://fotoseddy.novaprintoficial1.workers.dev";
const FECHA_ACTUALIZACION = "21 de agosto de 2026";

export default function PoliticaPrivacidadPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-sm leading-relaxed">
      <h1 className="mb-2 text-3xl font-bold">Política de Privacidad</h1>
      <p className="mb-8 text-gray-500">
        Última actualización: {FECHA_ACTUALIZACION}
      </p>

      <p className="mb-6">
        En {NOMBRE_NEGOCIO} ("nosotros", "nuestro" o "la empresa")
        valoramos tu privacidad. Esta política explica qué información
        recopilamos, cómo la usamos y qué derechos tenés sobre ella al
        utilizar nuestro sitio web ({URL_SITIO}) y sus servicios.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-semibold">
        1. Información que recopilamos
      </h2>
      <p className="mb-2">Podemos recopilar los siguientes datos:</p>
      <ul className="mb-4 list-disc space-y-1 pl-6">
        <li>
          <strong>Datos de cuenta (solo administradores):</strong> el acceso
          mediante inicio de sesión con Google está restringido
          exclusivamente al personal administrador del negocio. Si sos parte
          del equipo administrador e iniciás sesión con Google, recibimos tu
          nombre, correo electrónico y foto de perfil públicos asociados a tu
          cuenta, a través del proceso estándar de autenticación (OAuth). Los
          visitantes del sitio público (landing, catálogo de productos y
          servicios, galería) no necesitan iniciar sesión ni crear una
          cuenta para navegar el contenido.
        </li>
        <li>
          <strong>Datos de clientes:</strong> si realizás una compra o
          contratás un servicio, podemos almacenar tu nombre, correo
          electrónico, teléfono y datos de la transacción para gestionar tu
          pedido, tu historial de ventas y brindarte soporte.
        </li>
        <li>
          <strong>Imágenes y archivos:</strong> las imágenes que se muestran
          en el sitio (productos, servicios, galería) son gestionadas por el
          equipo administrador y pueden almacenarse mediante servicios de
          terceros como Google Drive.
        </li>
        <li>
          <strong>Datos técnicos:</strong> información básica de uso del
          sitio (páginas visitadas, tipo de navegador) con fines de
          funcionamiento y seguridad.
        </li>
      </ul>

      <h2 className="mb-2 mt-8 text-xl font-semibold">
        2. Cómo usamos tu información
      </h2>
      <ul className="mb-4 list-disc space-y-1 pl-6">
        <li>Para gestionar el panel administrativo y el acceso de usuarios autorizados.</li>
        <li>Para procesar ventas, pedidos y comunicarnos con clientes.</li>
        <li>Para mostrar contenido (productos, servicios, carrusel, galería) en el sitio.</li>
        <li>Para mejorar la seguridad y el funcionamiento del sitio.</li>
      </ul>
      <p className="mb-4">
        No vendemos ni compartimos tu información personal con terceros con
        fines publicitarios.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-semibold">
        3. Servicios de terceros
      </h2>
      <p className="mb-4">
        Utilizamos los siguientes proveedores para operar el sitio, quienes
        procesan datos conforme a sus propias políticas de privacidad:
      </p>
      <ul className="mb-4 list-disc space-y-1 pl-6">
        <li>
          <strong>Google (Sign-In / Drive):</strong> autenticación y
          almacenamiento de imágenes.
        </li>
        <li>
          <strong>Supabase:</strong> base de datos y autenticación de
          usuarios.
        </li>
        <li>
          <strong>Cloudflare:</strong> alojamiento e infraestructura del
          sitio.
        </li>
      </ul>

      <h2 className="mb-2 mt-8 text-xl font-semibold">
        4. Conservación de datos
      </h2>
      <p className="mb-4">
        Conservamos tu información mientras sea necesaria para los fines
        descritos en esta política, o mientras tengas una cuenta o relación
        comercial activa con nosotros.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-semibold">5. Tus derechos</h2>
      <p className="mb-4">
        Podés solicitar acceso, corrección o eliminación de tus datos
        personales en cualquier momento escribiéndonos a{" "}
        <a href={`mailto:${CORREO_SOPORTE}`} className="underline">
          {CORREO_SOPORTE}
        </a>
        .
      </p>

      <h2 className="mb-2 mt-8 text-xl font-semibold">6. Seguridad</h2>
      <p className="mb-4">
        Implementamos medidas técnicas y organizativas razonables para
        proteger tu información contra accesos no autorizados, pérdida o
        alteración.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-semibold">
        7. Cambios a esta política
      </h2>
      <p className="mb-4">
        Podemos actualizar esta política ocasionalmente. La fecha de la
        última actualización se indica al inicio de este documento.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-semibold">8. Contacto</h2>
      <p className="mb-4">
        Si tenés preguntas sobre esta política de privacidad, escribinos a{" "}
        <a href={`mailto:${CORREO_SOPORTE}`} className="underline">
          {CORREO_SOPORTE}
        </a>
        .
      </p>
    </main>
  );
}