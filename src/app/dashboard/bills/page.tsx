"use client";

import { useEffect, useState } from "react";
import {
  getBills,
  markBillAsPaid,
  toggleBillReminder,
} from "@/services/bills.services";
import { BillCard } from "@/components/bills/BillCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt } from "lucide-react";
import toast from "react-hot-toast";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Bill } from "@/shared/types/bills";

const BillCardSkeleton = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Receipt className="h-5 w-5 text-primary" />
        <Skeleton width={100} />
      </CardTitle>
    </CardHeader>
    <CardContent className="grid gap-2">
      <Skeleton height={20} />
      <Skeleton height={20} />
      <Skeleton height={20} />
    </CardContent>
  </Card>
);

export default function Page() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBills = async () => {
      setLoading(true);

      try {
        const data = await getBills();

        const mapped: Bill[] =
          data?.map((b: Bill) => ({
            id: String(b.id),
            name: b.name,
            amount: b.amount,
            due_date: new Date(b.due_date),
            category: b.category,
            status: b.status,
            company: b.company,
            reminder_enabled: b.reminder_enabled,
          })) ?? [];

        setBills(mapped);
      } catch {
        toast.error("Error fetching bills");
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  const handleMarkPaid = async (id: string) => {
    try {
      // Optimistic update
      setBills((prev) =>
        prev.map((bill) =>
          bill.id === id ? { ...bill, status: "paid" } : bill
        )
      );

      await markBillAsPaid(id);
      toast.success("Bill marked as paid");
    } catch {
      // Rollback if failed
      setBills((prev) =>
        prev.map((bill) =>
          bill.id === id ? { ...bill, status: "pending" } : bill
        )
      );
      toast.error("Failed to mark bill as paid");
    }
  };

  const handleToggleReminder = async (billId: string, enabled: boolean) => {
    try {
      await toggleBillReminder(billId, enabled);
    } catch {
      toast.error("Failed to toggle reminder");
    }
  };

  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-primary" />
          All Bills
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <SkeletonTheme baseColor="#f0f0f0" highlightColor="#e0e0e0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <BillCardSkeleton />
              <BillCardSkeleton />
              <BillCardSkeleton />
            </div>
          </SkeletonTheme>
        ) : bills.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Receipt className="h-16 w-16 text-muted-foreground" />
            <p className="mt-4 text-center text-lg text-muted-foreground">
              You haven&apos;t added any bills yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bills.map((bill) => (
              <BillCard
                key={bill.id}
                bill={bill}
                edit={true}
                mark={true}
                toggle={true}
                onMarkPaid={handleMarkPaid}
                onToggleReminder={handleToggleReminder}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
