import { ArrowUpRight, GitPullRequestDraft, Radar, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PullRequestView } from "@/lib/mock-data";

export function PullRequestCard({ pullRequest }: { pullRequest: PullRequestView }) {
  return (
    <div className="rounded-[1.75rem] border border-white/8 bg-black/30 p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline">{pullRequest.repository}</Badge>
            <span className="mono text-[11px] uppercase tracking-[0.24em] text-zinc-500">
              #{pullRequest.number}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">{pullRequest.title}</h3>
            <p className="mt-1 text-sm text-zinc-400">
              by {pullRequest.author} {"|"} {pullRequest.reviewStatus}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge>Risk {pullRequest.riskScore}</Badge>
          <Badge>Priority {pullRequest.priorityScore}</Badge>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2 text-zinc-300">
            <GitPullRequestDraft className="h-4 w-4" />
            <p className="text-sm font-medium">Review posture</p>
          </div>
          <p className="mt-3 text-sm leading-6 text-zinc-400">{pullRequest.summary}</p>
        </div>

        <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2 text-zinc-300">
            <Radar className="h-4 w-4" />
            <p className="text-sm font-medium">Impact explanation</p>
          </div>
          <p className="mt-3 text-sm leading-6 text-zinc-400">{pullRequest.impactSummary}</p>
          <div className="mt-3 rounded-[1.1rem] border border-white/8 bg-black/30 p-3 text-sm text-zinc-300">
            {pullRequest.impactExplanation}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button size="sm">
          <Sparkles className="mr-2 h-4 w-4" />
          Generate AI summary
        </Button>
        <Button size="sm" variant="ghost">
          Open PR
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
