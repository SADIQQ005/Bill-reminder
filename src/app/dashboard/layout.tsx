import { redirect } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { supabaseServer } from "@/lib/supaBaseServer";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = supabaseServer();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If no session, redirect to login
  if (!session) {
    redirect("/auth");
  }

  return <MainLayout>{children}</MainLayout>;
}
