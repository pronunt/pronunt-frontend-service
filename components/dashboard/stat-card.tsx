import { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  detail,
  icon: Icon
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
}) {
  return (
    <div className="panel rounded-[1.7rem] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mono text-[11px] uppercase tracking-[0.24em] text-zinc-500">{label}</p>
          <p className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-white">{value}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-zinc-100">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-zinc-400">{detail}</p>
    </div>
  );
}
