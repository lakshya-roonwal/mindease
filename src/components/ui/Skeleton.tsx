import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "card" | "chart" | "avatar";
}

export function Skeleton({ className, variant = "text", ...props }: SkeletonProps) {
  const baseClasses = "animate-pulse bg-muted/50 rounded-md";
  
  const variants = {
    text: "h-4 w-full",
    card: "h-32 w-full rounded-2xl",
    chart: "h-[300px] w-full rounded-3xl",
    avatar: "h-12 w-12 rounded-full",
  };

  return (
    <div
      className={cn(baseClasses, variants[variant], className)}
      {...props}
      aria-hidden="true"
    />
  );
}
