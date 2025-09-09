"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";

import { supabase } from "@/shared/libs/supabaseClient";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return <p>Loading...</p>;
  if (!user) {
    router.push("/auth");
    return null;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Welcome, {user.email}</h1>
      <Button
        onClick={async () => {
          await supabase.auth.signOut();
          router.push("/auth");
        }}
        className="mt-4"
      >
        Logout
      </Button>
    </div>
  );
}
