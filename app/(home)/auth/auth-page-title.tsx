"use client";

import { cn } from "@/lib/utils"; // (shadcn ui 프로젝트면 기본 제공)
import { ReactNode } from "react";

export default function AuthPageTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h1
      className={cn(
        "text-4xl font-extrabold bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent mb-6 tracking-tight",
        className
      )}
    >
      {children}
    </h1>
  );
}
