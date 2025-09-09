import { supabase } from "@/shared/libs/supabaseClient";
import { Bill } from "@/shared/types/bills";


export async function getBills(): Promise<Bill[]> {
  const { data, error } = await supabase
    .from("bills")
    .select("*")
    .order("due_date", { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function addBill(bill: Omit<Bill, "id" | "created_at">) {
  const { error } = await supabase.from("bills").insert(bill);
  if (error) throw new Error(error.message);
}

export async function deleteBill(id: string) {
  const { error } = await supabase.from("bills").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
