import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // ✅ Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // ✅ Fetch bills for this user
    const { data: bills, error } = await supabase
      .from("bills")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // ✅ Calculate stats
    const upcomingBills = bills.filter(
      (b) => b.status === "pending" || b.status === "overdue"
    );
    const overdueBills = bills.filter((b) => b.status === "overdue");
    const totalUpcoming = upcomingBills.reduce((sum, b) => sum + b.amount, 0);

    const now = new Date();
    const threeMonthsAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 3,
      now.getDate()
    );

    const lastThreeMonthsBills = bills.filter(
      (b) => new Date(b.due_date) >= threeMonthsAgo
    );

    const monthlyAverage =
      lastThreeMonthsBills.reduce((sum, b) => sum + b.amount, 0) / 3;

    return NextResponse.json({
      totalUpcoming,
      upcomingCount: upcomingBills.length,
      overdueCount: overdueBills.length,
      monthlyAverage: monthlyAverage || 0,
      recentBills: bills.slice(0, 6),
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
