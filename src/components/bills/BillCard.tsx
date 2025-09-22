"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Building, Bell, BellOff, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Bill } from "@/shared/types/bills";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface BillCardProps {
  bill: Bill;
  edit: boolean;
  mark: boolean;
  toggle: boolean;
  onMarkPaid?: (id: string) => Promise<void>;
  onToggleReminder?: (id: string, enabled: boolean) => Promise<void>;
}

export function BillCard({
  bill,
  edit,
  mark,
  toggle,
  onMarkPaid,
  onToggleReminder,
}: BillCardProps) {
  const router = useRouter();
  const [isMarkingPaid, setIsMarkingPaid] = useState(false);
  const [isTogglingReminder, setIsTogglingReminder] = useState(false);

  const handleEditClick = () => {
    router.push(`/dashboard/addBill?id=${bill.id}`);
  };

  const getStatusColor = (status: Bill["status"]) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
      default:
        return "bg-warning/10 text-warning border-warning/20";
    }
  };

  const getDaysUntilDue = () => {
    const now = new Date();
    const due = new Date(bill.due_date);

    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    return `Due in ${diffDays} days`;
  };

  const handleToggleReminder = async () => {
    if (!onToggleReminder) return;

    setIsTogglingReminder(true);
    try {
      await onToggleReminder(bill.id, !bill.reminder_enabled);
      toast.success(
        !bill.reminder_enabled
          ? "Reminder enabled for this bill"
          : "Reminder disabled"
      );
    } catch (err) {
      toast.error("Failed to update reminder");
    } finally {
      setIsTogglingReminder(false);
    }
  };

  const handleMarkPaid = async () => {
    if (!onMarkPaid) return;

    setIsMarkingPaid(true);
    try {
      await onMarkPaid(bill.id);
    } catch (err) {
    } finally {
      setIsMarkingPaid(false);
    }
  };

  const isDueDatePassed = new Date(bill.due_date) < new Date();

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
            <span className="text-lg font-bold text-foreground">
              {formatCurrency(bill.amount)}
            </span>
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
              {edit && (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 cursor-pointer"
                  onClick={handleEditClick}
                >
                  Edit
                </Button>
              )}
              {mark && (
                <Button
                  size="sm"
                  className="flex-1 cursor-pointer bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-300 hover:scale-105 hover:shadow-xl font-semibold"
                  onClick={handleMarkPaid}
                  disabled={isMarkingPaid}
                >
                  {isMarkingPaid ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Marking...
                    </>
                  ) : (
                    "Mark Paid"
                  )}
                </Button>
              )}
              {toggle && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleToggleReminder}
                  title={
                    isDueDatePassed
                      ? "Due date passed - reminder disabled"
                      : bill.reminder_enabled
                      ? "Disable Reminder"
                      : "Enable Reminder"
                  }
                  className="cursor-pointer"
                  disabled={isDueDatePassed || isTogglingReminder}
                >
                  {isTogglingReminder ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : !bill.reminder_enabled ? (
                    <Bell
                      className={`h-4 w-4 ${
                        isDueDatePassed ? "text-gray-400" : "text-green-500"
                      }`}
                    />
                  ) : (
                    <BellOff
                      className={`h-4 w-4 ${
                        isDueDatePassed
                          ? "text-gray-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
