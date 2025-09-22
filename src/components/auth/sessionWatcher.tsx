"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supaBaseClient";

export function SessionWatcher() {
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        if (!session) {
          router.replace("/auth"); // redirect to auth if logged out
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return null;
}
