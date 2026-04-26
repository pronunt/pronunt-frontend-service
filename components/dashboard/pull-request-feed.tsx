"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, RefreshCcw } from "lucide-react";

import type { PullRequestItem, PullRequestListResponse } from "@/lib/api-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function PullRequestFeed() {
  const [pullRequests, setPullRequests] = useState<PullRequestItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadPullRequests = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/frontend/pull-requests", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Unable to load pull requests.");
      }

      const payload = (await response.json()) as PullRequestListResponse;
      setPullRequests(payload.items);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to load pull requests.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPullRequests();
  }, []);

  if (isLoading) {
    return <div className="text-sm text-zinc-400">Loading the centralized pull request cockpit...</div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-medium text-white">Centralized pull requests</h3>
          <p className="mt-1 text-sm text-zinc-400">
            Every imported repository sends open pull requests into this shared review surface.
          </p>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={loadPullRequests}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      {pullRequests.length === 0 ? (
        <div className="rounded-[1.5rem] border border-white/8 bg-black/30 p-5 text-sm text-zinc-400">
          No pull requests have been imported yet. Connect GitHub and import at least one repository first.
        </div>
      ) : null}

      <div className="space-y-4">
        {pullRequests.map((pullRequest) => (
          <div key={pullRequest.id} className="rounded-[1.75rem] border border-white/8 bg-black/30 p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline">{pullRequest.repository_full_name}</Badge>
                  <span className="mono text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                    #{pullRequest.number}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">{pullRequest.title}</h3>
                  <p className="mt-1 text-sm text-zinc-400">
                    by {pullRequest.author_username} {"|"} {pullRequest.review_status}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge>Risk {pullRequest.risk_score}</Badge>
                <Badge>Priority {pullRequest.priority_score}</Badge>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-zinc-400">
              {pullRequest.impact_summary || "Impact summary will appear once dependency analysis completes."}
            </p>

            <div className="mt-5">
              <Button asChild size="sm" variant="ghost">
                <Link href={`/dashboard/prs/${pullRequest.id}`}>
                  Open details
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

