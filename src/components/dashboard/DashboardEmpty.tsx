"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export function EmptyState({ message }: { message: string }) {
  return (
    <Card className="flex flex-col items-center justify-center rounded-[0px]">
      <CardContent className="flex flex-col items-center text-center space-y-3">
        <FileText className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
}
