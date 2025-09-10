"use client";

import {
  LayoutDashboard,
  Receipt,
  Plus,
  Calendar,
  Settings,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    description: "Overview of your bills",
  },
  {
    title: "All Bills",
    url: "/bills",
    icon: Receipt,
    description: "Manage all bills",
  },
  {
    title: "Add Bill",
    url: "/add-bill",
    icon: Plus,
    description: "Add new bill",
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
    description: "View due dates",
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: TrendingUp,
    description: "Spending insights",
  },
  {
    title: "Payment Methods",
    url: "/payment-methods",
    icon: CreditCard,
    description: "Manage cards & accounts",
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    description: "App preferences",
  },
];

export function AppSidebar() {
  const currentPath = usePathname();

  return (
    <TooltipProvider>
      <div className="flex h-screen w-16 flex-col border-r border-sidebar-border bg-sidebar">
        {/* Logo */}
        <div className="flex h-16 items-center justify-center border-b border-sidebar-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
            <Receipt className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-2 p-2">
          {navigationItems.slice(0, -1).map((item) => (
            <Tooltip key={item.title} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={item.url}
                  className={`flex h-12 w-12 items-center justify-center rounded-lg transition-all duration-200 ${
                    currentPath === item.url
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-popover border-border">
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>

        {/* Settings at bottom */}
        <div className="p-2">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Link
                href="/settings"
                className={`flex h-12 w-12 items-center justify-center rounded-lg transition-all duration-200 ${
                  currentPath === "/settings"
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <Settings className="h-5 w-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-popover border-border">
              <p className="font-medium">Settings</p>
              <p className="text-xs text-muted-foreground">App preferences</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
