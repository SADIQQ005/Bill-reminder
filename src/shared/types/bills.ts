export type ApiResponse<T> = {
  success: boolean;
  data: T;
  error?: string;
};

export type BillRow = {
  id: string | number;
  name: string;
  amount: number;
  due_date: string | Date;
  category: string;
  status: string;
  company?: string;
};

export type Bill = {
  id?: string;
  user_id?: string;
  name: string;
  amount: number;
  due_date: Date;
  category: string;
  company?: string;
  frequency?: string;
  status?: "pending" | "paid" | "overdue";
  reminder_days_before?: number;
  reminder_enabled?: boolean;
  created_at?: string;
};

export type BillApiResponse = {
  id?: string;
  user_id?: string;
  name: string;
  amount: number;
  due_date: string;
  category: string;
  company?: string;
  frequency?: string;
  status?: "pending" | "paid" | "overdue";
  reminder_days_before?: number;
  reminder_enabled?: boolean;
  created_at?: string;
};
