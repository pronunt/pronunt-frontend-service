export function DashboardSectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="mono text-[11px] uppercase tracking-[0.26em] text-zinc-500">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-medium tracking-[-0.04em] text-white">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">{description}</p>
    </div>
  );
}
