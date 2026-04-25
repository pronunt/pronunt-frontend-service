import Link from "next/link";
import { ArrowRight, Github, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

const trustPoints = [
  "Connect GitHub once to start your mission.",
  "Repos appear only after the account is linked.",
  "Review signals stay in one Pronunt surface."
];

export function GithubConnectPanel({
  compact = false
}: {
  compact?: boolean;
}) {
  const loginHref = "/api/v1/auth/github/login";

  return (
    <div className="panel relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent pulse-line" />

      <div className={compact ? "space-y-5" : "grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center"}>
        <div className="space-y-5">
          <div className="mono inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] uppercase tracking-[0.28em] text-zinc-400">
            <Github className="h-3.5 w-3.5" />
            GitHub handshake
          </div>

          <div className="space-y-3">
            <h1 className={compact ? "text-3xl font-semibold tracking-[-0.04em] text-white" : "text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl"}>
              Connect GitHub before your astronaut starts collecting PR signals.
            </h1>
            <p className="max-w-xl text-base leading-7 text-zinc-400">
              Pronunt should stay empty until the account is linked. After that, repositories, impact paths, and summaries can enter the cockpit.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" className="group sm:min-w-[18rem]">
              <Link href={loginHref}>
                <Github className="mr-2 h-4 w-4" />
                Continue with GitHub
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="sm:min-w-[12rem]">
              <Link href="/">Back to landing</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-3">
          {trustPoints.map((point, index) => {
            const Icon = index === 0 ? Github : index === 1 ? ShieldCheck : Sparkles;
            return (
              <div
                key={point}
                className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl border border-white/10 bg-black/40 p-2 text-zinc-100">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="text-sm leading-6 text-zinc-300">{point}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
