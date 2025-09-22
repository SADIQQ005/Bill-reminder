"use client";

import { ReactNode } from "react";
import { AppSidebar } from "./AppSideBar";
import { SessionWatcher } from "../auth/sessionWatcher";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-background">
      <SessionWatcher />
      <AppSidebar />
      <main className="flex-1 overflow-y-auto p-4">{children}</main>
    </div>
  );
}