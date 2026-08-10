/**
 * Convierte una imagen a WebP en el navegador y limita su ancho/alto máximo.
 * Pensado para imágenes de la landing: no hace falta más resolución que la
 * que realmente se ve en pantalla, así que redimensionar + comprimir reduce
 * bastante el peso sin que se note la diferencia visual.
 *
 * Si algo falla (navegador viejo, SVG, etc.) devuelve el archivo original
 * tal cual, para que la subida nunca se rompa por esto.
 */
export async function optimizeImageToWebP(
  file: File,
  { maxDimension = 1920, quality = 0.82 }: { maxDimension?: number; quality?: number } = {}
): Promise<File> {
  // SVG es vectorial — no tiene sentido "rasterizarlo" a WebP.
  if (file.type === "image/svg+xml") return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/webp", quality)
    );
    if (!blob) return file;

    // Si por algún motivo el resultado "optimizado" pesa más que el original
    // (pasa con imágenes ya muy comprimidas), nos quedamos con el original.
    if (blob.size >= file.size) return file;

    const newName = file.name.replace(/\.[^.]+$/, "") + ".webp";
    return new File([blob], newName, { type: "image/webp" });
  } catch {
    return file;
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}