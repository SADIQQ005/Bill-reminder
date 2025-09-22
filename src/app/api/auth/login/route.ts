// app/api/auth/login/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/shared/types/supabase";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const supabase = createRouteHandlerClient<Database>({ cookies });

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    return NextResponse.json(
      { error: error?.message ?? "Login failed" },
      { status: 401 }
    );
  }

  // ✅ cookies auto-set, now return redirect
  return NextResponse.redirect(new URL("/dashboard", req.url));
}
