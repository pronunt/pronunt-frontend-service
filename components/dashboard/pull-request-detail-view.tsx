"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import type { PullRequestItem } from "@/lib/api-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function PullRequestDetailView({ id }: { id: string }) {
  const [pullRequest, setPullRequest] = useState<PullRequestItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPullRequest = async () => {
      try {
        const response = await fetch(`/api/frontend/pull-requests/${id}`, { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Unable to load pull request details.");
        }

        const payload = (await response.json()) as PullRequestItem;
        setPullRequest(payload);
      } catch (caughtError) {
        setError(
          caughtError instanceof Error ? caughtError.message : "Unable to load pull request details."
        );
      }
    };

    loadPullRequest();
  }, [id]);

  if (error) {
    return <p className="text-sm text-red-300">{error}</p>;
  }

  if (!pullRequest) {
    return <div className="text-sm text-zinc-400">Loading pull request details...</div>;
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to dashboard
        </Link>
      </Button>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline">{pullRequest.repository_full_name}</Badge>
          <Badge>Risk {pullRequest.risk_score}</Badge>
          <Badge>Priority {pullRequest.priority_score}</Badge>
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.05em] text-white">{pullRequest.title}</h1>
          <p className="mt-2 text-sm text-zinc-400">
            PR #{pullRequest.number} by {pullRequest.author_username}
          </p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5">
          <h2 className="text-sm font-medium text-white">Impact summary</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            {pullRequest.impact_summary || "Impact summary will appear here."}
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5">
          <h2 className="text-sm font-medium text-white">AI summary</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            {pullRequest.ai_summary || "Generate an AI summary after the repository sync completes."}
          </p>
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5">
        <h2 className="text-sm font-medium text-white">Detailed impact path</h2>
        <div className="mt-4 space-y-3">
          {pullRequest.impact_details.length === 0 ? (
            <p className="text-sm text-zinc-400">No downstream impact details are available yet.</p>
          ) : (
            pullRequest.impact_details.map((detail) => (
              <div key={`${detail.service_name}-${detail.relationship}`} className="rounded-[1.2rem] border border-white/8 bg-black/30 p-4">
                <p className="text-sm font-medium text-white">{detail.service_name}</p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{detail.explanation}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {pullRequest.html_url ? (
        <Button asChild size="sm">
          <Link href={pullRequest.html_url} target="_blank">
            Open on GitHub
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      ) : null}
    </div>
  );
}

