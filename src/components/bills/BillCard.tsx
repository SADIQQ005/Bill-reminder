"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, Building } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: Date;
  category: string;
  status: "paid" | "pending" | "overdue";
  company: string;
}

interface BillCardProps {
  bill: Bill;
  onMarkPaid?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function BillCard({ bill, onMarkPaid, onEdit }: BillCardProps) {
  const getStatusColor = (status: Bill["status"]) => {
    switch (status) {
      case "paid":
        return "bg-success/10 text-success border-success/20";
      case "overdue":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-warning/10 text-warning border-warning/20";
    }
  };

  const getDaysUntilDue = () => {
    const now = new Date();
    const diffTime = bill.dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    return `Due in ${diffDays} days`;
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card-hover transition-all duration-200 hover:shadow-brand-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground">{bill.name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building className="h-3 w-3" />
              {bill.company}
            </div>
          </div>
          <Badge className={getStatusColor(bill.status)}>{bill.status}</Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span className="text-lg font-bold text-foreground">
                ${bill.amount.toFixed(2)}
              </span>
            </div>
            <span className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">
              {bill.category}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{getDaysUntilDue()}</span>
          </div>

          {bill.status !== "paid" && (
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => onEdit?.(bill.id)}
              >
                Edit
              </Button>
              <Button
                size="sm"
                className="flex-1 cursor-pointer bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-300 hover:scale-105 hover:shadow-xl font-semibold"
                onClick={() => onMarkPaid?.(bill.id)}
              >
                Mark Paid
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
