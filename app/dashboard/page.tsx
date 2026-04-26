import Link from "next/link";
import { ArrowRight, CheckCircle2, FolderGit2, Github, Orbit, Radar } from "lucide-react";

import { DashboardSectionHeading } from "@/components/dashboard/dashboard-section-heading";
import { GithubConnectPanel } from "@/components/onboarding/github-connect-panel";
import { PullRequestFeed } from "@/components/dashboard/pull-request-feed";
import { Button } from "@/components/ui/button";

const missionSteps = [
  {
    title: "Connect GitHub",
    description: "Start the OAuth handshake so Pronunt can discover the repositories your team wants in orbit.",
    icon: Github
  },
  {
    title: "Choose repositories",
    description: "Select the services that should feed the review graph before any pull request enters the cockpit.",
    icon: FolderGit2
  },
  {
    title: "Read impact",
    description: "Once the repos are linked, risk, impact, and AI summaries will start filling this dashboard.",
    icon: Radar
  }
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <DashboardSectionHeading
        eyebrow="Dashboard"
        title="Cockpit is waiting for source control"
        description="Keep this surface empty until the GitHub handshake is complete and the first repositories are selected."
      />

      <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="panel rounded-[2rem] p-6 sm:p-8">
          <div className="space-y-5">
            <div className="mono inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] uppercase tracking-[0.28em] text-zinc-400">
              <Orbit className="h-3.5 w-3.5" />
              Empty dashboard
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
                No repositories are in orbit yet.
              </h2>
              <p className="max-w-2xl text-base leading-7 text-zinc-400">
                Pronunt only starts drawing pull request intelligence after GitHub is connected and the first repositories are chosen.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild size="lg" className="group sm:min-w-[16rem]">
                <Link href="/connect">
                  Connect GitHub
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="sm:min-w-[14rem]">
                <Link href="/dashboard/import">Choose repositories</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {missionSteps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl border border-white/10 bg-black/40 p-2 text-zinc-100">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">{step.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="panel rounded-[2rem] p-6 sm:p-8">
        <div className="space-y-4">
          <DashboardSectionHeading
            eyebrow="Readiness"
            title="What appears after connection"
            description="Once the repos are selected, this cockpit will fill with deterministic priority, dependency impact, and in-house AI summaries."
          />

          <div className="grid gap-4 md:grid-cols-3">
            {[
              "Repository health and ownership",
              "Cross-service impact paths",
              "Review summaries and risk signals"
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-white/8 bg-black/30 p-4"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-zinc-100" />
                  <p className="text-sm leading-6 text-zinc-300">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel rounded-[2rem] p-6 sm:p-8">
        <PullRequestFeed />
      </section>
    </div>
  );
}
