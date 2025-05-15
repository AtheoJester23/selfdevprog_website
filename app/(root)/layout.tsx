import { auth } from "@/auth";
import ClientLayout from "@/components/ClientLayout";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return <ClientLayout session={session}>{children}</ClientLayout>;
}
