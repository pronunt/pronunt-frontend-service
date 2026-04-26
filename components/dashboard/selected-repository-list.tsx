"use client";

import { useEffect, useState } from "react";
import { FolderGit2, RefreshCcw } from "lucide-react";

import type { ServiceConfig, ServiceConfigListResponse } from "@/lib/api-types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function SelectedRepositoryList() {
  const [repositories, setRepositories] = useState<ServiceConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRepositories = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/frontend/config/services", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Unable to load selected repositories.");
      }

      const payload = (await response.json()) as ServiceConfigListResponse;
      setRepositories(payload.items);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error ? caughtError.message : "Unable to load selected repositories."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRepositories();
  }, []);

  return (
    <div className="space-y-5 overflow-x-hidden">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-medium text-white">Repositories in orbit</h3>
          <p className="mt-1 text-sm text-zinc-400">
            These repositories are already registered in the Pronunt review graph.
          </p>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={loadRepositories}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      {isLoading ? <div className="text-sm text-zinc-400">Loading selected repositories...</div> : null}

      {!isLoading && repositories.length === 0 ? (
        <div className="rounded-[1.5rem] border border-white/8 bg-black/30 p-5 text-sm text-zinc-400">
          No repositories have been added to the cockpit yet.
        </div>
      ) : null}

      <div className="max-h-[34rem] space-y-4 overflow-y-auto overflow-x-hidden pr-1">
        {repositories.map((repository) => (
          <div
            key={repository.id}
            className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-white/10 bg-black/40 p-2 text-zinc-100">
                <FolderGit2 className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-medium text-white">{repository.display_name}</h4>
                  <Badge variant="outline" className="shrink-0">
                    {repository.criticality}
                  </Badge>
                </div>
                <p className="mono mt-1 break-all text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                  {repository.repository_full_name}
                </p>
                {repository.description ? (
                  <p className="mt-3 text-sm leading-6 text-zinc-400">{repository.description}</p>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
