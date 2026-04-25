import { GitPullRequest, Orbit, Radar, Sparkles } from "lucide-react";

const planets = [
  {
    name: "risk",
    icon: Radar,
    orbitClass: "orbit-ring orbit-ring-one",
    nodeClass: "orbit-node orbit-node-one"
  },
  {
    name: "impact",
    icon: Orbit,
    orbitClass: "orbit-ring orbit-ring-two",
    nodeClass: "orbit-node orbit-node-two"
  },
  {
    name: "summary",
    icon: Sparkles,
    orbitClass: "orbit-ring orbit-ring-three",
    nodeClass: "orbit-node orbit-node-three"
  }
];

export function OrbitScene() {
  return (
    <div className="panel relative overflow-hidden rounded-[2.5rem] px-6 py-8 sm:px-8">
      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent pulse-line" />
      <div className="relative min-h-[30rem]">
        <div className="space-y-2">
          <p className="mono text-[11px] uppercase tracking-[0.3em] text-zinc-500">Mission view</p>
          <h2 className="text-2xl font-medium text-white">PR Astronaut in orbit</h2>
        </div>

        <div className="relative mt-10 flex h-[24rem] items-center justify-center">
          {planets.map((planet) => {
            const Icon = planet.icon;
            return (
              <div key={planet.name} className={planet.orbitClass}>
                <div className={planet.nodeClass}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
            );
          })}

          <div className="astronaut-core">
            <div className="astronaut-visor" />
            <div className="astronaut-pack" />
            <GitPullRequest className="h-5 w-5 text-black" />
          </div>

          <div className="signal-card signal-card-left">
            <p className="mono text-[10px] uppercase tracking-[0.28em] text-zinc-500">Captured</p>
            <p className="mt-2 text-sm text-white">PR #303 reached the cockpit.</p>
          </div>

          <div className="signal-card signal-card-right">
            <p className="mono text-[10px] uppercase tracking-[0.28em] text-zinc-500">Trajectory</p>
            <p className="mt-2 text-sm text-white">Impact travels across connected services.</p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <SceneStat label="Repos in orbit" value="12" />
          <SceneStat label="Signals captured" value="42" />
          <SceneStat label="AI route" value="in-house" />
        </div>
      </div>
    </div>
  );
}

function SceneStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.3rem] border border-white/8 bg-white/[0.03] px-4 py-3">
      <p className="mono text-[10px] uppercase tracking-[0.28em] text-zinc-500">{label}</p>
      <p className="mt-2 text-lg font-medium text-white">{value}</p>
    </div>
  );
}
