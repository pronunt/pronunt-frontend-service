"use client";

import { useEffect, useState, useTransition } from "react";
import { ArrowRight, CheckCircle2, FolderGit2, Lock, Orbit, RefreshCcw, Sparkles } from "lucide-react";

import type {
  ConnectedRepository,
  ConnectedRepositoryListResponse,
  ServiceConfigListResponse
} from "@/lib/api-types";
import { Button } from "@/components/ui/button";

export function RepositoryImportView() {
  const [isPending, startTransition] = useTransition();
  const [repositories, setRepositories] = useState<ConnectedRepository[]>([]);
  const [selectedRepositories, setSelectedRepositories] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [activeImport, setActiveImport] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadRepositories = () => {
    startTransition(async () => {
      setError(null);

      try {
        const [reposResponse, selectedResponse] = await Promise.all([
          fetch("/api/frontend/repos", { cache: "no-store" }),
          fetch("/api/frontend/config/services", { cache: "no-store" })
        ]);

        if (!reposResponse.ok) {
          throw new Error("Unable to load connected repositories.");
        }

        if (!selectedResponse.ok) {
          throw new Error("Unable to load selected repositories.");
        }

        const repoPayload = (await reposResponse.json()) as ConnectedRepositoryListResponse;
        const selectedPayload = (await selectedResponse.json()) as ServiceConfigListResponse;

        setRepositories(repoPayload.items);
        setSelectedRepositories(new Set(selectedPayload.items.map((item) => item.repository_full_name)));
      } catch (caughtError) {
        setError(
          caughtError instanceof Error ? caughtError.message : "Unable to load connected repositories."
        );
      }
    });
  };

  useEffect(() => {
    loadRepositories();
  }, []);

  const importRepository = (repository: ConnectedRepository) => {
    startTransition(async () => {
      setError(null);
      setMessage(null);
      setActiveImport(repository.full_name);

      try {
        const response = await fetch("/api/frontend/import", {
          body: JSON.stringify({
            name: repository.name,
            owner: repository.owner,
            full_name: repository.full_name,
            private: repository.private,
            default_branch: repository.default_branch,
            html_url: repository.html_url
          }),
          headers: { "Content-Type": "application/json" },
          method: "POST"
        });

        if (!response.ok) {
          throw new Error("Unable to queue repository pull requests.");
        }

        const payload = (await response.json()) as {
          queued_pull_requests?: number;
          repository_full_name?: string;
        };

        setSelectedRepositories((current) => new Set(current).add(repository.full_name));
        setMessage(
          payload.queued_pull_requests && payload.queued_pull_requests > 0
            ? `Queued ${payload.queued_pull_requests} open pull request(s) from ${repository.full_name} into the cockpit.`
            : `${repository.full_name} is now in orbit. There are no open pull requests to ingest right now.`
        );
      } catch (caughtError) {
        setError(
          caughtError instanceof Error ? caughtError.message : "Unable to queue repository pull requests."
        );
      } finally {
        setActiveImport(null);
      }
    });
  };

  if (isPending && repositories.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-[1.8rem] border border-white/8 bg-black/25 px-6 py-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%)]" />
        <div className="relative flex min-h-[20rem] flex-col items-center justify-center text-center">
          <div className="relative flex h-28 w-28 items-center justify-center">
            <div className="absolute h-28 w-28 rounded-full border border-white/10" />
            <div className="absolute h-20 w-20 rounded-full border border-dashed border-cyan-300/30 animate-[spin_8s_linear_infinite]" />
            <div className="absolute h-12 w-12 rounded-full border border-white/12" />
            <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-100 shadow-[0_0_30px_rgba(207,250,254,0.45)]" />
            <div className="absolute left-[18%] top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/40 p-2 text-cyan-100 animate-[orbit-two_10s_linear_infinite]">
              <Orbit className="h-4 w-4" />
            </div>
            <div className="absolute left-[72%] top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/40 p-2 text-zinc-100 animate-[orbit-one_8s_linear_infinite]">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <p className="mono mt-6 text-[11px] uppercase tracking-[0.3em] text-zinc-500">
            Repository orbit loading
          </p>
          <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-400">
            Pronunt is pulling the connected organization repositories into this intake console.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 overflow-x-hidden">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-medium text-white">Connected repositories</h3>
          <p className="mt-1 text-sm text-zinc-400">
            Choose which GitHub repositories should start feeding pull requests into Pronunt.
          </p>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={loadRepositories}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-300">{message}</p> : null}

            <div className="space-y-4 overflow-x-hidden">
        {repositories.map((repository) => (
          <div key={repository.id} className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5">
            <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl border border-white/10 bg-black/40 p-2 text-zinc-100">
                    <FolderGit2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-medium text-white">{repository.name}</h3>
                    <p className="mono mt-1 break-all text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                      {repository.full_name}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-sm text-zinc-400">
                  <span>Default branch: {repository.default_branch}</span>
                  <span>{repository.private ? "Private" : "Public"}</span>
                  {selectedRepositories.has(repository.full_name) ? (
                    <span className="inline-flex items-center gap-1 text-emerald-300">
                      <CheckCircle2 className="h-4 w-4" />
                      In orbit
                    </span>
                  ) : null}
                </div>
              </div>

              <Button
                type="button"
                size="sm"
                className="shrink-0"
                onClick={() => importRepository(repository)}
                disabled={isPending && activeImport === repository.full_name}
              >
                {selectedRepositories.has(repository.full_name)
                  ? isPending && activeImport === repository.full_name
                    ? "Syncing..."
                    : "Sync PRs again"
                  : isPending && activeImport === repository.full_name
                    ? "Importing..."
                    : "Import PRs"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {repositories.length === 0 && !error ? (
        <div className="rounded-[1.5rem] border border-white/8 bg-black/30 p-5 text-sm text-zinc-400">
          <div className="flex items-center gap-3">
            <Lock className="h-4 w-4 text-zinc-200" />
            No repositories are available yet for this connected account.
          </div>
        </div>
      ) : null}
    </div>
  );
}
