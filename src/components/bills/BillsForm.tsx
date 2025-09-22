"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/shared/libs/supabaseClient";
import { addBill } from "@/services/bills.services";
import toast from "react-hot-toast";

export default function BillForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState(new Date().toISOString().substring(0, 10));
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("You must be logged in.");
      setLoading(false);
      return;
    }

    try {
      await addBill({
        name,
        amount: Number(amount),
        due_date: new Date(dueDate),
        category,
        user_id: user.id,
      });
      setName("");
      setAmount("");
      setDueDate("");
      setCategory("");
      onSuccess();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <div>
        <Label>Bill Title</Label>
        <Input
          placeholder="e.g. Electricity Bill"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label>Amount</Label>
        <Input
          type="number"
          placeholder="e.g. 5000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div>
        <Label>Due Date</Label>
        <Input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
      </div>
      <div>
        <Label>Category</Label>
        <Input
          placeholder="e.g. Rent, Data, Subscription"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Saving..." : "Add Bill"}
      </Button>
    </form>
  );
}
