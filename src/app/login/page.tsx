import { LoginView } from "@/features/auth/views/LoginView";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  return <LoginView debugParams={params} />;
}