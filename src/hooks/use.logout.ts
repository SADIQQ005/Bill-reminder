"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useLogout() {
  const router = useRouter();

  const logout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });

      if (res.redirected) {
        router.replace(res.url); // goes to /auth
      } else {
        toast.error("Logout failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  return { logout };
}
