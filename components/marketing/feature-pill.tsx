import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function FeaturePill({
  title,
  description,
  icon: Icon,
  className
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <div className={cn("panel rounded-[1.6rem] p-4", className)}>
      <div className="flex items-start gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2 text-white">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-white">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
        </div>
      </div>
    </div>
  );
}
