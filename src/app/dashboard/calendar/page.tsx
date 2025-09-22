"use client";

import BillCalendar from "@/components/calendar/CalendarView";
import { getBills } from "@/services/bills.services";
import { Bill } from "@/shared/types/bills";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [bills, setBills] = useState<Bill[]>([]);

  useEffect(() => {
    const fetchBills = async () => {
      setLoading(true);

      try {
        const data = await getBills();

        const mapped: Bill[] =
          data?.map((b: any) => ({
            id: String(b.id),
            name: b.name,
            amount: b.amount,
            due_date: new Date(b.due_date),
            category: b.category,
            status: b.status,
            company: b.company,
          })) ?? [];

        setBills(mapped);
      } catch (_err) {
        toast.error("Failed to load bill");
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  return (
    <div className="p-8">
      {loading ? (
        <div className="space-y-4">
          {/* Skeleton calendar header */}
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />

          {/* Skeleton grid */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                className="h-20 rounded-lg bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        </div>
      ) : (
        <BillCalendar
          bills={bills.map((bill) => ({ ...bill, title: bill.name }))}
        />
      )}
    </div>
  );
}
