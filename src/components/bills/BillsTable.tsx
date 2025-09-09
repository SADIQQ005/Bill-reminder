"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Bill } from "@/shared/types/bills";
import { deleteBill, getBills } from "@/services/bills.services";

export default function BillsTable() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBills = async () => {
    try {
      setLoading(true);
      const data = await getBills();
      setBills(data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bill?")) return;
    try {
      await deleteBill(id);
      loadBills();
    } catch (err: any) {
      alert(err.message);
    }
  };

  useEffect(() => {
    loadBills();
  }, []);

  if (loading) return <p>Loading bills...</p>;

  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold mb-4">Your Bills</h2>
      {bills.length === 0 ? (
        <p>No bills added yet.</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Due Date</th>
              <th className="p-2 text-left">Category</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.id} className="border-t">
                <td className="p-2">{bill.title}</td>
                <td className="p-2">₦{bill.amount}</td>
                <td className="p-2">{bill.due_date}</td>
                <td className="p-2">{bill.category}</td>
                <td className="p-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(bill.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
