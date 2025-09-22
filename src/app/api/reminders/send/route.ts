// /app/api/reminders/send/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // 1. Get all bills due in ≤5 days
    const { data: bills, error } = await supabase
      .from("bills")
      .select("*, users(email)")
      .lte(
        "due_date",
        new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
      )
      .gte("due_date", new Date().toISOString()) // not overdue
      .eq("reminder_enabled", true);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // 2. Loop through bills and send reminders
    for (const bill of bills ?? []) {
      const userEmail = bill.users?.email as string | undefined;
      if (!userEmail) continue;

      await resend.emails.send({
        from: "Bill Reminder <reminders@yourapp.com>",
        to: userEmail,
        subject: `Reminder: ${bill.name} is due soon`,
        html: `
          <p>Hi there 👋,</p>
          <p>Your bill <strong>${bill.name}</strong> with ${bill.company} is due on <strong>${bill.due_date}</strong>.</p>
          <p>Amount: <strong>₦${bill.amount}</strong></p>
          <p>Don’t forget to pay it on time ✅.</p>
        `,
      });
    }

    return NextResponse.json({ success: true, count: bills?.length ?? 0 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
