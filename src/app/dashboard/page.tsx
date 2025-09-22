"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { BillCard } from "@/components/bills/BillCard";
import { Button } from "@/components/ui/button";
import {
  Receipt,
  DollarSign,
  Calendar,
  TrendingUp,
  Plus,
  Bell,
} from "lucide-react";
import { getDashboardStats, markBillAsPaid } from "@/services/bills.services";
import { DashboardSkeleton } from "@/components/dashboard/DashbaordSkeletonLoading";
import { EmptyState } from "@/components/dashboard/DashboardEmpty";
import { Bill } from "@/shared/types/bills";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    totalUpcoming: number;
    upcomingCount: number;
    overdueCount: number;
    monthlyAverage: number;
    recentBills: Bill[];
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const dashboardStats = await getDashboardStats();
        setStats({
          totalUpcoming: dashboardStats.totalUpcoming,
          upcomingCount: dashboardStats.upcomingCount,
          overdueCount: dashboardStats.overdueCount,
          monthlyAverage: dashboardStats.monthlyAverage,
          recentBills: dashboardStats.recentBills.map(
            (bill: { due_date: string }) => ({
              ...bill,
              dueDate: new Date(bill.due_date),
            })
          ),
        });
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMarkPaid = async (id: string) => {
    try {
      // Optimistic update
      setStats((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          recentBills: prev.recentBills.map((bill) =>
            bill.id === id ? { ...bill, status: "paid" } : bill
          ),
        };
      });

      await markBillAsPaid(id);
      toast.success("Bill marked as paid");
    } catch (err) {
      // Rollback to original status if failed
      setStats((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          recentBills: prev.recentBills.map((bill) =>
            bill.id === id ? { ...bill, status: "pending" } : bill
          ),
        };
      });

      toast.error("Failed to mark bill as paid");
    }
  };
  if (loading) return <DashboardSkeleton />;

  if (!stats || stats.recentBills.length === 0) {
    return (
      <div>
        <EmptyState message="No bills found. Add a bill to get started!" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Overview of your bills and payments
            </p>
          </div>
          <Button className="bg-gradient-primary border-0">
            <Plus className="mr-2 h-4 w-4" />
            Add Bill
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Upcoming"
            value={formatCurrency(stats.totalUpcoming)}
            subtitle="This month"
            icon={DollarSign}
          />
          <StatsCard
            title="Bills Due Soon"
            value={stats.upcomingCount.toString()}
            subtitle="Next 7 days"
            icon={Calendar}
          />
          <StatsCard
            title="Overdue Bills"
            value={stats.overdueCount.toString()}
            subtitle="Needs attention"
            icon={Bell}
          />
          <StatsCard
            title="Monthly Average"
            value={`₦${stats.monthlyAverage.toFixed(2)}`}
            subtitle="Last 3 months"
            icon={TrendingUp}
          />
        </div>

        {/* Recent Bills */}
        <Card className="rounded-[0px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              Recent Bills
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentBills.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stats.recentBills.map((bill) => (
                  <BillCard
                    key={bill.id}
                    bill={bill}
                    edit={false}
                    mark={true}
                    toggle={false}
                    onMarkPaid={handleMarkPaid}
                  />
                ))}
              </div>
            ) : (
              <EmptyState message="No recent bills yet." />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
