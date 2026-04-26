"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, FolderGit2, Orbit, Radar } from "lucide-react";
import { useEffect, useState } from "react";

import type { PullRequestListResponse } from "@/lib/api-types";
import { Button } from "@/components/ui/button";

const readySteps = [
  {
    title: "Choose repositories",
    description: "Keep expanding the review graph by importing the services your team wants in orbit first.",
    icon: FolderGit2
  },
  {
    title: "Read impact",
    description: "Every imported pull request keeps its dependency path, risk score, and AI summary in one place.",
    icon: Radar
  }
];

const liveSteps = [
  {
    title: "Pull requests centralized",
    description: "Imported repositories are already sending open pull requests into this shared cockpit.",
    icon: CheckCircle2
  },
  {
    title: "Import more repositories",
    description: "Add more services whenever you want to widen the review orbit and enrich the impact graph.",
    icon: FolderGit2
  }
];

export function DashboardOverviewState() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasPullRequests, setHasPullRequests] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPullRequests() {
      try {
        const response = await fetch("/api/frontend/pull-requests", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Unable to load pull requests.");
        }

        const payload = (await response.json()) as PullRequestListResponse;
        if (!cancelled) {
          setHasPullRequests(payload.items.length > 0);
        }
      } catch (caughtError) {
        if (!cancelled) {
          setError(
            caughtError instanceof Error ? caughtError.message : "Unable to load pull requests."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadPullRequests();

    return () => {
      cancelled = true;
    };
  }, []);

  const missionSteps = hasPullRequests ? liveSteps : readySteps;

  return (
    <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
      <div className="panel rounded-[2rem] p-6 sm:p-8">
        <div className="space-y-5">
          <div className="mono inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] uppercase tracking-[0.28em] text-zinc-400">
            <Orbit className="h-3.5 w-3.5" />
            {hasPullRequests ? "Live cockpit" : "Repository intake"}
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
              {hasPullRequests
                ? "Pull request intelligence is in orbit."
                : "No repositories are in orbit yet."}
            </h2>
            <p className="max-w-2xl text-base leading-7 text-zinc-400">
              {hasPullRequests
                ? "Your imported repositories are already feeding pull requests into Pronunt. Open a PR below or widen the orbit with more repositories."
                : "Your GitHub session is active. The next step is choosing which repositories should start sending pull requests into the review graph."}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" className="group sm:min-w-[16rem]">
              <Link href="/dashboard/import">
                {hasPullRequests ? "Import more repositories" : "Choose repositories"}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            {!hasPullRequests ? (
              <Button asChild variant="ghost" size="lg" className="sm:min-w-[14rem]">
                <Link href="/dashboard/import">Open import console</Link>
              </Button>
            ) : null}
          </div>

          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          {isLoading ? (
            <p className="text-sm text-zinc-500">Checking live pull request intake...</p>
          ) : null}
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
  );
}
