"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { BillCard, Bill } from "@/components/bills/BillCard";
import { Button } from "@/components/ui/button";
import { 
  Receipt, 
  DollarSign, 
  Calendar, 
  TrendingUp,
  Plus,
  Bell
} from "lucide-react";
import { addDays, subDays } from "date-fns";

// Mock data for demonstration
const mockBills: Bill[] = [
  {
    id: "1",
    name: "Netflix Subscription",
    amount: 15.99,
    dueDate: addDays(new Date(), 3),
    category: "Entertainment",
    status: "pending",
    company: "Netflix Inc."
  },
  {
    id: "2",
    name: "Electric Bill",
    amount: 89.42,
    dueDate: addDays(new Date(), 7),
    category: "Utilities",
    status: "pending",
    company: "City Power & Light"
  },
  {
    id: "3",
    name: "Internet Service",
    amount: 79.99,
    dueDate: subDays(new Date(), 2),
    category: "Utilities",
    status: "overdue",
    company: "FiberNet"
  },
  {
    id: "4",
    name: "Car Insurance",
    amount: 142.50,
    dueDate: subDays(new Date(), 5),
    category: "Insurance",
    status: "paid",
    company: "SafeDrive Insurance"
  }
];

export default function Dashboard() {
  const upcomingBills = mockBills.filter(bill => 
    bill.status === "pending" || bill.status === "overdue"
  );

  const totalUpcoming = upcomingBills.reduce((sum, bill) => sum + bill.amount, 0);
  const overdueBills = mockBills.filter(bill => bill.status === "overdue");

  const handleMarkPaid = (id: string) => {
    // TODO: Implement mark as paid functionality
    console.log("Marking bill as paid:", id);
  };

  const handleEditBill = (id: string) => {
    // TODO: Implement edit bill functionality
    console.log("Editing bill:", id);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
            value={`$${totalUpcoming.toFixed(2)}`}
            subtitle="This month"
            icon={DollarSign}
            trend={{ value: "12% from last month", isPositive: false }}
          />
          <StatsCard
            title="Bills Due Soon"
            value={upcomingBills.length.toString()}
            subtitle="Next 7 days"
            icon={Calendar}
          />
          <StatsCard
            title="Overdue Bills"
            value={overdueBills.length.toString()}
            subtitle="Needs attention"
            icon={Bell}
          />
          <StatsCard
            title="Monthly Average"
            value="$387.50"
            subtitle="Last 3 months"
            icon={TrendingUp}
            trend={{ value: "8% decrease", isPositive: true }}
          />
        </div>

        {/* Recent Bills */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              Recent Bills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockBills.slice(0, 6).map((bill) => (
                <BillCard
                  key={bill.id}
                  bill={bill}
                  onMarkPaid={handleMarkPaid}
                  onEdit={handleEditBill}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}