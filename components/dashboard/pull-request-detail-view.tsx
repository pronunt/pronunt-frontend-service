"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Loader2, Sparkles, X } from "lucide-react";

import type { PullRequestItem, PullRequestSummaryResponse } from "@/lib/api-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getImpactTone, getPriorityTone, getRiskTone } from "@/lib/dashboard/pr-styles";

export function PullRequestDetailView({ id }: { id: string }) {
  const [pullRequest, setPullRequest] = useState<PullRequestItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [insightError, setInsightError] = useState<string | null>(null);
  const [latestInsight, setLatestInsight] = useState<PullRequestSummaryResponse | null>(null);
  const [animatedInsight, setAnimatedInsight] = useState("");

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

  useEffect(() => {
    const source = latestInsight?.ai_summary ?? pullRequest?.ai_summary ?? "";
    if (!source) {
      setAnimatedInsight("");
      return;
    }

    const words = source.split(/\s+/).filter(Boolean);
    let cursor = 0;
    setAnimatedInsight("");

    const interval = window.setInterval(() => {
      cursor += 1;
      setAnimatedInsight(words.slice(0, cursor).join(" "));
      if (cursor >= words.length) {
        window.clearInterval(interval);
      }
    }, 42);

    return () => window.clearInterval(interval);
  }, [latestInsight?.ai_summary, pullRequest?.ai_summary]);

  if (error) {
    return <p className="text-sm text-red-300">{error}</p>;
  }

  if (!pullRequest) {
    return <div className="text-sm text-zinc-400">Loading pull request details...</div>;
  }

  const hasInsight = Boolean(pullRequest.ai_summary);

  const handleGetInsights = async () => {
    setIsInsightsOpen(true);
    setIsGeneratingInsights(true);
    setInsightError(null);

    try {
      const response = await fetch(`/api/frontend/pull-requests/${id}/summary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        throw new Error("Unable to generate insights right now.");
      }

      const payload = (await response.json()) as PullRequestSummaryResponse;
      setLatestInsight(payload);
      setPullRequest((current) =>
        current
          ? {
              ...current,
              ai_summary: payload.ai_summary
            }
          : current
      );
    } catch (caughtError) {
      setInsightError(
        caughtError instanceof Error ? caughtError.message : "Unable to generate insights right now."
      );
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/prs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to pull requests
          </Link>
        </Button>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline">{pullRequest.repository_full_name}</Badge>
            <Badge className={getRiskTone(pullRequest.risk_score).badge}>Risk {pullRequest.risk_score}</Badge>
            <Badge className={getPriorityTone(pullRequest.priority_score).badge}>
              Priority {pullRequest.priority_score}
            </Badge>
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-[-0.05em] text-white">{pullRequest.title}</h1>
            <p className="mt-2 text-sm text-zinc-400">
              PR #{pullRequest.number} by {pullRequest.author_username}
            </p>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <div
            className={`rounded-[1.5rem] border bg-white/[0.03] p-5 ${getPriorityTone(
              pullRequest.priority_score
            ).card}`}
          >
            <h2 className="text-sm font-medium text-white">Impact summary</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              {pullRequest.impact_summary || "Impact summary will appear here."}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-cyan-400/20 bg-cyan-500/[0.04] p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-medium text-white">AI summary</h2>
                <p className="mt-3 text-sm leading-6 text-cyan-100/90">
                  {pullRequest.ai_summary || "Generate an AI summary when you want deeper review insights."}
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                className="rounded-full bg-cyan-200 px-4 text-black hover:bg-cyan-100"
                onClick={handleGetInsights}
                disabled={isGeneratingInsights}
              >
                {isGeneratingInsights ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating
                  </>
                ) : hasInsight ? (
                  <>
                    Open insights
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Get insights
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className={`rounded-[1.5rem] border bg-white/[0.03] p-5 ${getRiskTone(pullRequest.risk_score).card}`}>
          <h2 className="text-sm font-medium text-white">Detailed impact path</h2>
          <div className="mt-4 space-y-3">
            {pullRequest.impact_details.length === 0 ? (
              <p className="text-sm text-zinc-400">No downstream impact details are available yet.</p>
            ) : (
              pullRequest.impact_details.map((detail) => (
                <div
                  key={`${detail.service_name}-${detail.relationship}`}
                  className={`rounded-[1.2rem] border bg-black/30 p-4 ${getImpactTone(detail.relationship)}`}
                >
                  <p className="text-sm font-medium">{detail.service_name}</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">{detail.explanation}</p>
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

      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          isInsightsOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsInsightsOpen(false)}
      />
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col border-l border-cyan-400/20 bg-[#101113]/95 shadow-2xl backdrop-blur-xl transition-transform duration-300 ${
          isInsightsOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-[0.72rem] uppercase tracking-[0.42em] text-cyan-200/65">AI Insights</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">Pull request review notes</h2>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-10 w-10 rounded-full border border-white/10 p-0 text-zinc-300 hover:bg-white/5 hover:text-white"
            onClick={() => setIsInsightsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm font-medium text-white">{pullRequest.title}</p>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              {pullRequest.repository_full_name} · PR #{pullRequest.number}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Badge className={getRiskTone(pullRequest.risk_score).badge}>Risk {pullRequest.risk_score}</Badge>
            <Badge className={getPriorityTone(pullRequest.priority_score).badge}>
              Priority {pullRequest.priority_score}
            </Badge>
            {latestInsight ? (
              <Badge className="border border-cyan-400/25 bg-cyan-400/10 text-cyan-100">
                {latestInsight.generated_by} · {latestInsight.model}
              </Badge>
            ) : null}
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-cyan-400/20 bg-cyan-500/[0.04] p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-medium text-white">Generated summary</h3>
              <Button
                type="button"
                size="sm"
                className="rounded-full bg-cyan-200 px-4 text-black hover:bg-cyan-100"
                onClick={handleGetInsights}
                disabled={isGeneratingInsights}
              >
                {isGeneratingInsights ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Refreshing
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Refresh insights
                  </>
                )}
              </Button>
            </div>
            <div className="mt-4 space-y-4">
              {insightError ? <p className="text-sm text-red-300">{insightError}</p> : null}
              {isGeneratingInsights ? (
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[0.72rem] uppercase tracking-[0.35em] text-cyan-100/80">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-200/70" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-100" />
                    </span>
                    Thinking
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-full animate-pulse rounded-full bg-cyan-100/10" />
                    <div className="h-3 w-11/12 animate-pulse rounded-full bg-cyan-100/10" />
                    <div className="h-3 w-8/12 animate-pulse rounded-full bg-cyan-100/10" />
                  </div>
                  <p className="text-sm leading-7 text-cyan-100/70">
                    Pronunt is reading the repository context, review urgency, and downstream impact.
                  </p>
                </div>
              ) : (
                <p className="text-sm leading-7 text-cyan-100/90">
                  {animatedInsight ||
                    "No AI summary exists yet. Press Get insights to generate one for this pull request."}
                  {animatedInsight ? <span className="ml-1 inline-block h-5 w-px animate-pulse bg-cyan-100/70 align-middle" /> : null}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
            <h3 className="text-sm font-medium text-white">Impact context</h3>
            <p className="mt-3 text-sm leading-6 text-zinc-300">{pullRequest.impact_summary}</p>
            <div className="mt-4 space-y-3">
              {pullRequest.impact_details.map((detail) => (
                <div
                  key={`${detail.service_name}-panel-${detail.relationship}`}
                  className={`rounded-[1.1rem] border bg-black/30 p-4 ${getImpactTone(detail.relationship)}`}
                >
                  <p className="text-sm font-medium">{detail.service_name}</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">{detail.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
