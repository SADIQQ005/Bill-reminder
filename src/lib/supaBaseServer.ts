import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/shared/types/supabase";

export const supabaseServer = () =>
  createServerComponentClient<Database>({ cookies });
