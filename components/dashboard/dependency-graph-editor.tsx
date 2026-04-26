"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { RefreshCcw, Save } from "lucide-react";

import type {
  DependencyGraphItem,
  ImpactResponse,
  ServiceConfig,
  ServiceConfigListResponse
} from "@/lib/api-types";
import { Button } from "@/components/ui/button";

function buildDependencyDocument(serviceName: string, dependsOn: string[]): DependencyGraphItem {
  return {
    service_name: serviceName,
    depends_on: [...dependsOn].sort()
  };
}

function syntaxHighlightJson(value: string) {
  const escaped = value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped.replace(
    /("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"\s*:?)|("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*")|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      if (/^".*":$/.test(match)) {
        return `<span class="text-emerald-300">${match}</span>`;
      }
      if (/^"/.test(match)) {
        return `<span class="text-zinc-100">${match}</span>`;
      }
      if (/true|false/.test(match)) {
        return `<span class="text-sky-200">${match}</span>`;
      }
      if (/null/.test(match)) {
        return `<span class="text-zinc-500">${match}</span>`;
      }
      return `<span class="text-white">${match}</span>`;
    }
  );
}

export function DependencyGraphEditor() {
  const [services, setServices] = useState<ServiceConfig[]>([]);
  const [selectedServiceName, setSelectedServiceName] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedService = useMemo(
    () => services.find((item) => item.service_name === selectedServiceName) ?? null,
    [services, selectedServiceName]
  );

  const parsedDraft = useMemo(() => {
    try {
      if (!draft.trim()) {
        return null;
      }

      return JSON.parse(draft) as DependencyGraphItem;
    } catch {
      return null;
    }
  }, [draft]);

  const loadServices = () => {
    startTransition(async () => {
      setLoadError(null);

      try {
        const response = await fetch("/api/frontend/config/services", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Unable to load tracked services.");
        }

        const payload = (await response.json()) as ServiceConfigListResponse;
        setServices(payload.items);
        if (!selectedServiceName && payload.items[0]) {
          setSelectedServiceName(payload.items[0].service_name);
        }
      } catch (caughtError) {
        setLoadError(
          caughtError instanceof Error ? caughtError.message : "Unable to load tracked services."
        );
      }
    });
  };

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    if (!selectedServiceName) {
      return;
    }

    startTransition(async () => {
      setLoadError(null);

      try {
        const response = await fetch(`/api/frontend/config/impact/${selectedServiceName}`, {
          cache: "no-store"
        });

        if (!response.ok) {
          throw new Error("Unable to load dependency graph.");
        }

        const payload = (await response.json()) as ImpactResponse;
        setDraft(JSON.stringify(buildDependencyDocument(payload.service_name, payload.direct_dependencies), null, 2));
      } catch (caughtError) {
        setLoadError(
          caughtError instanceof Error ? caughtError.message : "Unable to load dependency graph."
        );
      }
    });
  }, [selectedServiceName]);

  useEffect(() => {
    if (!draft.trim()) {
      setValidationError(null);
      return;
    }

    if (parsedDraft) {
      setValidationError(null);
      return;
    }

    setValidationError("JSON syntax is invalid. Fix the document before saving.");
  }, [draft, parsedDraft]);

  const saveDraft = () => {
    startTransition(async () => {
      setMessage(null);
      setLoadError(null);

      if (!parsedDraft) {
        setValidationError("JSON syntax is invalid. Fix the document before saving.");
        return;
      }

      try {
        const response = await fetch("/api/frontend/config/dependencies", {
          body: JSON.stringify(parsedDraft),
          headers: { "Content-Type": "application/json" },
          method: "POST"
        });

        if (!response.ok) {
          throw new Error("Unable to save dependency graph.");
        }

        setMessage("Dependency graph saved.");
      } catch (caughtError) {
        setLoadError(
          caughtError instanceof Error ? caughtError.message : "Unable to save dependency graph."
        );
      }
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium text-white">Services</h3>
          <Button type="button" variant="ghost" size="sm" onClick={loadServices}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        <div className="space-y-2">
          {services.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedServiceName(item.service_name)}
              className={`w-full rounded-[1.25rem] border px-4 py-3 text-left transition ${
                item.service_name === selectedServiceName
                  ? "border-emerald-400/30 bg-emerald-500/[0.08] text-white"
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
            <h3 className="text-base font-medium text-white">Dependency graph editor</h3>
            <p className="mt-1 text-sm text-zinc-400">
              Edit the direct dependency graph as JSON. Keys are highlighted in green and values stay white.
            </p>
          </div>
          <Button type="button" size="sm" onClick={saveDraft} disabled={isPending || !parsedDraft}>
            <Save className="mr-2 h-4 w-4" />
            Save graph
          </Button>
        </div>

        {validationError ? <p className="text-sm text-amber-300">{validationError}</p> : null}
        {loadError ? <p className="text-sm text-red-300">{loadError}</p> : null}
        {message ? <p className="text-sm text-emerald-300">{message}</p> : null}

        <div className="grid gap-4 xl:grid-cols-2">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            spellCheck={false}
            className="mono min-h-[28rem] w-full rounded-[1.5rem] border border-white/8 bg-black/40 p-5 text-sm leading-6 text-zinc-200 outline-none transition focus:border-emerald-400/30"
            placeholder='{\n  "service_name": "opslora-order-service",\n  "depends_on": ["opslora-auth-service"]\n}'
          />

          <div className="rounded-[1.5rem] border border-white/8 bg-black/40 p-5">
            <p className="mono mb-4 text-[11px] uppercase tracking-[0.26em] text-zinc-500">
              Compiled preview
            </p>
            <pre
              className="mono overflow-auto whitespace-pre-wrap text-sm leading-7"
              dangerouslySetInnerHTML={{
                __html: syntaxHighlightJson(parsedDraft ? JSON.stringify(parsedDraft, null, 2) : draft || "{}")
              }}
            />
          </div>
        </div>

        {selectedService ? (
          <div className="rounded-[1.5rem] border border-cyan-400/20 bg-cyan-500/[0.05] p-4 text-sm text-cyan-100">
            Editing dependency edges for <span className="font-medium">{selectedService.display_name}</span>.
          </div>
        ) : null}
      </div>
    </div>
  );
}
