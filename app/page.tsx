import Link from "next/link";
import { ArrowRight, Github, Orbit, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand/brand-mark";
import { FeaturePill } from "@/components/marketing/feature-pill";

const features = [
  {
    title: "Deterministic review intelligence",
    icon: Orbit,
    description: "Risk, priority, and dependency impact stay grounded in system logic first."
  },
  {
    title: "In-house AI by default",
    icon: Sparkles,
    description: "Use your own Ollama-backed runtime, with optional provider override when you need it."
  },
  {
    title: "Protected by platform controls",
    icon: ShieldCheck,
    description: "Built for teams running trunk, GitOps, and policy-checked delivery on Kubernetes."
  }
];

export default function HomePage() {
  return (
    <main className="noise-overlay relative overflow-hidden">
      <div className="absolute inset-x-0 top-[-16rem] h-[28rem] rounded-full bg-white/8 blur-3xl" />
      <div className="absolute inset-y-0 right-[-12rem] top-20 h-96 w-96 rounded-full border border-white/10 bg-white/[0.03] blur-2xl float-slow" />

      <section className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-12 lg:px-10">
        <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="fade-up space-y-8">
            <BrandMark />

            <div className="space-y-5">
              <div className="mono inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.32em] text-zinc-300">
                <span className="h-2 w-2 rounded-full bg-white/70" />
                Pronunt PRISM
              </div>

              <h1 className="max-w-4xl text-balance text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
                Review every pull request from one monochrome command surface.
              </h1>

              <p className="max-w-2xl text-balance text-base leading-7 text-zinc-300 sm:text-lg">
                Continue with GitHub, connect your repositories, and let Pronunt map risk, priority,
                downstream impact, and AI summaries without turning your workflow into noise.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="group">
                <Link href="/dashboard/import">
                  <Github className="mr-2 h-4 w-4" />
                  Continue with GitHub
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link href="/dashboard">Preview dashboard</Link>
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {features.map((feature, index) => (
                <FeaturePill
                  key={feature.title}
                  className={index === 1 ? "fade-up-delay" : "fade-up"}
                  {...feature}
                />
              ))}
            </div>
          </div>

          <div className="fade-up-delay">
            <div className="panel relative overflow-hidden rounded-[2rem] p-6">
              <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent pulse-line" />
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="mono text-[11px] uppercase tracking-[0.28em] text-zinc-500">Live surface</p>
                  <h2 className="mt-2 text-2xl font-medium text-white">Unified review field</h2>
                </div>
                <div className="mono rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-zinc-300">
                  main / secure
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <PreviewMetric label="Open PRs" value="42" accent="high priority" />
                  <PreviewMetric label="High risk" value="9" accent="critical repos" />
                  <PreviewMetric label="Awaiting review" value="17" accent="triaged" />
                </div>

                <div className="rounded-[1.5rem] border border-white/8 bg-black/35 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">pronunt-aggregator-service#303</p>
                      <p className="mono mt-1 text-xs uppercase tracking-[0.24em] text-zinc-500">
                        impact explanation validation
                      </p>
                    </div>
                    <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-200">
                      priority 64
                    </div>
                  </div>

                  <div className="space-y-3 text-sm text-zinc-300">
                    <p>
                      Downstream impact is visible before review starts. AI summaries stay optional and
                      deterministic signals stay primary.
                    </p>
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3 text-zinc-200">
                      pronunt-frontend-service is impacted because it depends on
                      pronunt-worker-service, which depends on pronunt-aggregator-service.
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <MiniPanel
                    eyebrow="Connected"
                    title="Import GitHub projects"
                    description="Bring repositories in like SonarQube onboarding, but keep the whole review graph in one place."
                  />
                  <MiniPanel
                    eyebrow="Runtime"
                    title="In-house by default"
                    description="Route summaries to your own Ollama-backed model first, and opt out only when you choose."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function PreviewMetric({
  label,
  value,
  accent
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4">
      <p className="mono text-[11px] uppercase tracking-[0.24em] text-zinc-500">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <span className="text-3xl font-semibold tracking-[-0.06em] text-white">{value}</span>
        <span className="text-right text-xs text-zinc-400">{accent}</span>
      </div>
    </div>
  );
}

function MiniPanel({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/8 bg-black/25 p-4">
      <p className="mono text-[11px] uppercase tracking-[0.24em] text-zinc-500">{eyebrow}</p>
      <h3 className="mt-3 text-base font-medium text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
    </div>
  );
}
