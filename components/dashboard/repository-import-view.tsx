"use client";

import { useEffect, useState, useTransition } from "react";
import { ArrowRight, FolderGit2, Lock, RefreshCcw } from "lucide-react";

import type { ConnectedRepository, ConnectedRepositoryListResponse } from "@/lib/api-types";
import { Button } from "@/components/ui/button";

export function RepositoryImportView() {
  const [isPending, startTransition] = useTransition();
  const [repositories, setRepositories] = useState<ConnectedRepository[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeImport, setActiveImport] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadRepositories = () => {
    startTransition(async () => {
      setError(null);

      try {
        const response = await fetch("/api/frontend/repos", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Unable to load connected repositories.");
        }

        const payload = (await response.json()) as ConnectedRepositoryListResponse;
        setRepositories(payload.items);
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
          body: JSON.stringify({ name: repository.name, owner: repository.owner }),
          headers: { "Content-Type": "application/json" },
          method: "POST"
        });

        if (!response.ok) {
          throw new Error("Unable to queue repository pull requests.");
        }

        setMessage(`Queued pull requests from ${repository.full_name} into the cockpit.`);
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
    return <div className="text-sm text-zinc-400">Loading repositories in orbit...</div>;
  }

  return (
    <div className="space-y-4">
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

      <div className="grid gap-4">
        {repositories.map((repository) => (
          <div key={repository.id} className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl border border-white/10 bg-black/40 p-2 text-zinc-100">
                    <FolderGit2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-white">{repository.name}</h3>
                    <p className="mono mt-1 text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                      {repository.full_name}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-sm text-zinc-400">
                  <span>Default branch: {repository.default_branch}</span>
                  <span>{repository.private ? "Private" : "Public"}</span>
                </div>
              </div>

              <Button
                type="button"
                size="sm"
                onClick={() => importRepository(repository)}
                disabled={isPending && activeImport === repository.full_name}
              >
                {isPending && activeImport === repository.full_name ? "Importing..." : "Import PRs"}
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

