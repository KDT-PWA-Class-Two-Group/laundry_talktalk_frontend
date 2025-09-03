import { cn } from "@/lib/utils";
import * as React from "react";

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

export function Separator({ className, orientation = "horizontal", ...props }: SeparatorProps) {
  return (
    <div
      role="separator"
      className={cn("shrink-0 bg-border h-px w-full", className)}
      {...props}
    />
  );
}
