"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

import BillsTable from "@/components/bills/BillsTable";
import BillForm from "@/components/bills/BillsForm";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return <p>Loading...</p>;
  if (!user) {
    router.push("/auth");
    return null;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Welcome, {user.email}</h1>
      <BillForm onSuccess={() => window.location.reload()} />
      <BillsTable />
    </div>
  );
}
