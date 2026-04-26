"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { RefreshCcw, Save } from "lucide-react";

import type { ServiceConfig, ServiceConfigListResponse } from "@/lib/api-types";
import { Button } from "@/components/ui/button";

function formatDocument(document: ServiceConfig) {
  return JSON.stringify(document, null, 2);
}

export function RepositoryConfigEditor() {
  const [items, setItems] = useState<ServiceConfig[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedId) ?? null,
    [items, selectedId]
  );

  const loadItems = () => {
    startTransition(async () => {
      setError(null);

      try {
        const response = await fetch("/api/frontend/config/services", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Unable to load configuration graph.");
        }

        const payload = (await response.json()) as ServiceConfigListResponse;
        setItems(payload.items);

        const firstItem = payload.items[0] ?? null;
        setSelectedId((current) =>
          current && payload.items.some((item) => item.id === current) ? current : firstItem?.id ?? null
        );
        setDraft((currentDraft) => {
          if (currentDraft && currentDraft.trim().length > 0 && selectedId) {
            return currentDraft;
          }
          return firstItem ? formatDocument(firstItem) : "";
        });
      } catch (caughtError) {
        setError(
          caughtError instanceof Error ? caughtError.message : "Unable to load configuration graph."
        );
      }
    });
  };

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    if (selectedItem) {
      setDraft(formatDocument(selectedItem));
    }
  }, [selectedItem]);

  const saveDraft = () => {
    startTransition(async () => {
      setError(null);
      setMessage(null);

      try {
        const parsed = JSON.parse(draft) as ServiceConfig;
        const response = await fetch("/api/frontend/config/services", {
          body: JSON.stringify({
            service_name: parsed.service_name,
            repository_full_name: parsed.repository_full_name,
            display_name: parsed.display_name,
            description: parsed.description ?? null,
            criticality: parsed.criticality,
            owners: parsed.owners ?? [],
            tags: parsed.tags ?? []
          }),
          headers: { "Content-Type": "application/json" },
          method: "POST"
        });

        if (!response.ok) {
          throw new Error("Unable to save configuration.");
        }

        setMessage("Configuration saved.");
        loadItems();
      } catch (caughtError) {
        setError(caughtError instanceof Error ? caughtError.message : "Unable to save configuration.");
      }
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium text-white">Tracked services</h3>
          <Button type="button" variant="ghost" size="sm" onClick={loadItems}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className={`w-full rounded-[1.25rem] border px-4 py-3 text-left transition ${
                item.id === selectedId
                  ? "border-white/20 bg-white/[0.06] text-white"
                  : "border-white/8 bg-black/30 text-zinc-300 hover:border-white/12 hover:bg-white/[0.03]"
              }`}
            >
              <div className="text-sm font-medium">{item.display_name}</div>
              <div className="mono mt-1 text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                {item.service_name}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-medium text-white">Service config editor</h3>
            <p className="mt-1 text-sm text-zinc-400">
              Edit the tracked repository config as JSON and save it back into the graph.
            </p>
          </div>
          <Button type="button" size="sm" onClick={saveDraft} disabled={isPending || !selectedItem}>
            <Save className="mr-2 h-4 w-4" />
            Save config
          </Button>
        </div>

        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        {message ? <p className="text-sm text-emerald-300">{message}</p> : null}

        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          spellCheck={false}
          className="mono min-h-[32rem] w-full rounded-[1.5rem] border border-white/8 bg-black/40 p-5 text-sm leading-6 text-zinc-200 outline-none transition focus:border-white/20"
          placeholder="Select a tracked service to edit its JSON config."
        />
      </div>
    </div>
  );
}
