"use client";

import { addBill, getBillById, updateBill } from "@/services/bills.services";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Bell } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function BillForm() {
  const searchParams = useSearchParams();
  const billId = searchParams.get("id");

  const [form, setForm] = useState({
    name: "",
    amount: "",
    due_date: "",
    category: "",
    company: "",
    frequency: "monthly",
    reminder_days_before: 3,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

 useEffect(() => {
  if (billId) {
    setFetching(true);
    getBillById(billId)
      .then(({ data }) => {
        if (data) {
          setForm(prevForm => ({
            ...prevForm,
            ...data,
            amount: data.amount.toString(), 
            due_date: data.due_date.slice(0, 10), 
          }));
        } else {
          toast.error("Bill not found");
        }
      })
      .catch(() => {
        toast.error("Failed to load bill");
      })
      .finally(() => setFetching(false));
  }
}, [billId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (billId) {
        // Update existing bill
        await updateBill(billId, {
          ...form,
          amount: parseFloat(form.amount),
          due_date: new Date(form.due_date),
          reminder_days_before: parseInt(String(form.reminder_days_before), 10),
        });
      } else {

        // Add new bill
        await addBill({
          ...form,
          amount: parseFloat(form.amount),
          due_date: new Date(form.due_date),
          reminder_days_before: parseInt(String(form.reminder_days_before), 10),
        });
      }

      toast.success(
        billId
          ? "Bill updated successfully!"
          : "Bill with reminder added successfully!"
      );

      // Reset form
      setForm({
        name: "",
        amount: "",
        due_date: "",
        category: "",
        company: "",
        frequency: "",
        reminder_days_before: 3,
      });
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
    <div className="flex items-center justify-center min-h-screen bg-muted/30">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="flex flex-col items-center justify-center text-center text-2xl font-bold">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-zinc rounded-full flex items-center justify-center shadow-zinc">
              <Bell className="w-8 h-8 text-zinc-600" />
            </div>
            {billId ? "Edit Bill & Reminder" : "Add Bill & Reminder"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {fetching ? (
            // Skeleton loader
            <div className="space-y-4 animate-pulse">
              <div className="h-10 bg-gray-300 rounded"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
              <div className="h-12 bg-gray-400 rounded"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Bill Name</Label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Netflix Subscription"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div>
                <Label htmlFor="amount">Amount</Label>
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  name="amount"
                  placeholder="15.99"
                  value={form.amount}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div>
                <Label htmlFor="due_date">Due Date</Label>
                <input
                  id="due_date"
                  type="date"
                  name="due_date"
                  value={form.due_date}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <input
                  id="category"
                  type="text"
                  name="category"
                  placeholder="Entertainment"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <Label htmlFor="company">Company</Label>
                <input
                  id="company"
                  type="text"
                  name="company"
                  placeholder="Netflix Inc."
                  value={form.company}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <select
                  id="frequency"
                  name="frequency"
                  value={form.frequency}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="one-time">One-time</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div>
                <Label htmlFor="reminder_days_before">
                  Remind me (days before due date)
                </Label>
                <input
                  id="reminder_days_before"
                  type="number"
                  name="reminder_days_before"
                  placeholder="3"
                  value={form.reminder_days_before}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`cursor-pointer bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-300 group px-8 py-3 rounded-lg font-semibold w-full ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Saving..." : billId ? "Update Bill" : "Add Bill"}
              </button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
