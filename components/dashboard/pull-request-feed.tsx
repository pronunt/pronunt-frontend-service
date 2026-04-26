"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowUpRight, RefreshCcw } from "lucide-react";

import type {
  PullRequestItem,
  PullRequestListResponse,
  ServiceConfigListResponse
} from "@/lib/api-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPriorityTone, getRiskTone } from "@/lib/dashboard/pr-styles";

export function PullRequestFeed() {
  const [isPending, startTransition] = useTransition();
  const [pullRequests, setPullRequests] = useState<PullRequestItem[]>([]);
  const [selectedRepositoryCount, setSelectedRepositoryCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadPullRequests = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [pullRequestResponse, repositoryResponse] = await Promise.all([
        fetch("/api/frontend/pull-requests", { cache: "no-store" }),
        fetch("/api/frontend/config/services", { cache: "no-store" })
      ]);

      if (!pullRequestResponse.ok) {
        throw new Error("Unable to load pull requests.");
      }

      if (!repositoryResponse.ok) {
        throw new Error("Unable to load selected repositories.");
      }

      const payload = (await pullRequestResponse.json()) as PullRequestListResponse;
      const repositoryPayload = (await repositoryResponse.json()) as ServiceConfigListResponse;
      setPullRequests(payload.items);
      setSelectedRepositoryCount(repositoryPayload.items.length);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to load pull requests.");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshOrbitPullRequests = () => {
    startTransition(async () => {
      setError(null);
      setMessage(null);

      try {
        const response = await fetch("/api/frontend/pull-requests/refresh", {
          method: "POST"
        });

        const payload = (await response.json()) as {
          code?: string;
          message?: string;
          repositories_synced?: number;
          queued_pull_requests?: number;
          failures?: Array<{ repository_full_name: string; status: number }>;
        };

        if (!response.ok && response.status !== 207) {
          throw new Error(payload.message || "Unable to refresh pull requests for repositories in orbit.");
        }

        if (payload.failures && payload.failures.length > 0) {
          setError(
            `Refreshed ${payload.repositories_synced ?? 0} repositories, but ${payload.failures.length} sync request(s) failed.`
          );
        } else {
          setMessage(
            `Refreshed ${payload.repositories_synced ?? 0} repositories in orbit and queued ${payload.queued_pull_requests ?? 0} open pull request(s).`
          );
        }

        await loadPullRequests();
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to refresh pull requests for repositories in orbit."
        );
      }
    });
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
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={loadPullRequests} disabled={isLoading || isPending}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Reload list
          </Button>
          <Button type="button" size="sm" onClick={refreshOrbitPullRequests} disabled={isPending || selectedRepositoryCount === 0}>
            <RefreshCcw className={`mr-2 h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
            Refresh orbit PRs
          </Button>
        </div>
      </div>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-300">{message}</p> : null}

      {pullRequests.length === 0 ? (
        <div className="rounded-[1.5rem] border border-white/8 bg-black/30 p-5 text-sm text-zinc-400">
          {selectedRepositoryCount > 0
            ? "Selected repositories are in orbit, but there are no open pull requests to display right now."
            : "No pull requests have been imported yet. Choose at least one repository first."}
        </div>
      ) : null}

      <div className="space-y-4">
        {pullRequests.map((pullRequest) => (
          <div
            key={pullRequest.id}
            className={`rounded-[1.75rem] border bg-black/30 p-5 ${
              getRiskTone(pullRequest.risk_score).card
            }`}
          >
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
                <Badge className={getRiskTone(pullRequest.risk_score).badge}>
                  Risk {pullRequest.risk_score}
                </Badge>
                <Badge className={getPriorityTone(pullRequest.priority_score).badge}>
                  Priority {pullRequest.priority_score}
                </Badge>
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
