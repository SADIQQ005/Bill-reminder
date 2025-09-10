"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
}: StatsCardProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card-hover transition-colors duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-foreground">{value}</h3>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
            {trend && (
              <div
                className={`text-xs flex items-center gap-1 ${
                  trend.isPositive ? "text-success" : "text-destructive"
                }`}
              >
                <span>{trend.isPositive ? "↗" : "↘"}</span>
                {trend.value}
              </div>
            )}
          </div>
          <div className="rounded-lg bg-primary/10 p-3">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
