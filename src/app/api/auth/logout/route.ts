import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/shared/types/supabase";

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  // Sign out (this clears the Supabase cookies automatically)
  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.redirect(new URL("/auth", req.url));
}
