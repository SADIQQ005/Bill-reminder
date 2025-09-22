export type Bill = {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  due_date: Date;
  category: string;
  company: string;
  frequency: string;
  status: "pending" | "paid" | 'overdue'  ;
  reminder_days_before: number;
  reminder_enabled: boolean
  created_at: string;
};
