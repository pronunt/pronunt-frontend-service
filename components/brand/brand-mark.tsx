import { Orbit, Rocket } from "lucide-react";

export function BrandMark() {
  return (
    <div className="inline-flex items-center gap-4 rounded-full border border-white/10 bg-black/28 px-3 py-3 backdrop-blur-sm">
      <div className="relative flex h-12 w-12 items-center justify-center rounded-[1rem] border border-white/10 bg-white/[0.05]">
        <Rocket className="h-6 w-6 text-white" />
        <div className="absolute -bottom-1 -right-1 rounded-full border border-white/10 bg-black px-2 py-1 text-[10px] text-zinc-300">
          <Orbit className="h-3 w-3" />
        </div>
      </div>
      <div>
        <p className="mono text-[11px] uppercase tracking-[0.28em] text-zinc-500">Pronunt</p>
        <h2 className="mt-1 text-base font-medium text-white">PR Astronaut</h2>
      </div>
    </div>
  );
}
