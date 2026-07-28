import { createAdminClient } from "@/lib/supabase/admin";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const DRIVE_API = "https://www.googleapis.com/drive/v3";
const DRIVE_UPLOAD_API = "https://www.googleapis.com/upload/drive/v3";

async function getAccessToken(): Promise<string> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("drive_credentials")
    .select("refresh_token")
    .eq("id", 1)
    .single();

  if (error || !data?.refresh_token) {
    throw new Error(
      "No hay credenciales de Drive guardadas. El admin debe volver a loguearse para conceder el permiso."
    );
  }

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: data.refresh_token,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    throw new Error(`No se pudo renovar el token de Drive: ${await res.text()}`);
  }

  const json = await res.json();
  return json.access_token as string;
}

export async function createDriveFolder(name: string, parentId?: string) {
  const token = await getAccessToken();

  const res = await fetch(`${DRIVE_API}/files`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: parentId ? [parentId] : undefined,
    }),
  });

  if (!res.ok) throw new Error(`Error creando carpeta en Drive: ${await res.text()}`);
  const json = await res.json();
  return json.id as string;
}

export async function uploadImageToDrive(
  file: Blob,
  filename: string,
  folderId: string
): Promise<{ fileId: string; directUrl: string }> {
  const token = await getAccessToken();

  const metadata = { name: filename, parents: [folderId] };
  const form = new FormData();
  form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
  form.append("file", file);

  const uploadRes = await fetch(`${DRIVE_UPLOAD_API}/files?uploadType=multipart&fields=id`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  if (!uploadRes.ok) throw new Error(`Error subiendo a Drive: ${await uploadRes.text()}`);
  const { id: fileId } = await uploadRes.json();

  const permRes = await fetch(`${DRIVE_API}/files/${fileId}/permissions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role: "reader", type: "anyone" }),
  });

  if (!permRes.ok) throw new Error(`Error dando permiso público: ${await permRes.text()}`);

  const directUrl = `https://lh3.googleusercontent.com/d/${fileId}=w1600`;

  return { fileId, directUrl };
}

export async function deleteImageFromDrive(fileId: string) {
  const token = await getAccessToken();

  const res = await fetch(`${DRIVE_API}/files/${fileId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok && res.status !== 404) {
    throw new Error(`Error eliminando de Drive: ${await res.text()}`);
  }
}