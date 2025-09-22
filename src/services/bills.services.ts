import { Bill } from "@/shared/types/bills";

const BASE_URL = "/api/bills";

// Add a bill
export async function addBill(bill: any) {
  const res = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bill),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to add bill");

  return data.data;
}

// Get all bills for logged-in user
export async function getBills() {
  const res = await fetch(`${BASE_URL}`, { method: "GET" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch bills");
  return data.data;
}

// Get dashboard stats
export async function getDashboardStats() {
  const res = await fetch("/api/dashboard", { method: "GET" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch dashboard stats");
  return data;
}

export async function getBillById(id: string): Promise<Bill> {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch bill");
  const { data } = await res.json();
  return data;
}

export async function updateBill(
  id: string,
  updates: Partial<Bill>
): Promise<Bill> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (!res.ok) throw new Error("Failed to update bill");
  const { data } = await res.json();
  return data;
}

export async function markBillAsPaid(id: string): Promise<Bill> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
  });

  if (!res.ok) throw new Error("Failed to mark bill as paid");
  const { data } = await res.json();
  return data;
}

export async function toggleBillReminder(id: string, enabled: boolean): Promise<Bill> {
  const res = await fetch(`${BASE_URL}/${id}/toggleReminder`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reminder_enabled: enabled }),
  });

  if (!res.ok) throw new Error("Failed to toggle reminder");
  const { data } = await res.json();
  return data;
}

