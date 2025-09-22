// /app/api/bills/[id]/toggleReminder/route.ts

/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const { reminder_enabled } = await req.json();

  const { data, error } = await supabase
    .from("bills")
    .update({ reminder_enabled })
    .eq("id", context.params.id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, data });
}
