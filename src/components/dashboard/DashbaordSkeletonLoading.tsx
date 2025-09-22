"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card
            key={i}
            className="bg-card/50 border-border/50 animate-pulse h-24"
          >
            <CardHeader className="h-6 bg-muted rounded w-1/3 mb-2"></CardHeader>
            <CardContent className="h-8 bg-muted rounded w-2/3"></CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-[0px]">
        <CardHeader className="h-6 bg-muted animate-pulse rounded w-1/4"></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 bg-muted rounded-lg animate-pulse"
            ></div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
