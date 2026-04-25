import { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  variant = "default"
}: {
  children: ReactNode;
  className?: string;
  variant?: "default" | "outline";
}) {
  return (
    <span
      className={cn(
        "mono inline-flex items-center rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.24em]",
        variant === "default"
          ? "border border-white/10 bg-white/[0.08] text-zinc-100"
          : "border border-white/12 bg-transparent text-zinc-300",
        className
      )}
    >
      {children}
    </span>
  );
}
