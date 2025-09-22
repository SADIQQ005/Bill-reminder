export type Database = {
  public: {
    Tables: {
      bills: {
        Row: {
          id: string
          name: string
          amount: number
          due_date: string
          category: string
          company: string
          frequency: string
          status: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          amount: number
          due_date: string
          category?: string
          company?: string
          frequency: string
          status?: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          amount?: number
          due_date?: string
          category?: string
          company?: string
          frequency?: string
          status?: string
          user_id?: string
          created_at?: string
        }
      }
    }
  }
}
