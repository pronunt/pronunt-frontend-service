import type { ComponentType } from "react";
import { ArrowRight, Boxes, FolderGit2, GitFork, ShieldEllipsis } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImportableProject } from "@/lib/mock-data";

export function ImportRepoCard({ project }: { project: ImportableProject }) {
  return (
    <div className="panel rounded-[1.75rem] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2 text-zinc-100">
              <FolderGit2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-medium text-white">{project.name}</h3>
              <p className="mono mt-1 text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                {project.repository}
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-zinc-400">{project.description}</p>
        </div>
        <Badge>{project.criticality}</Badge>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <RepoMetric icon={Boxes} label="Dependencies" value={String(project.dependencies)} />
        <RepoMetric icon={GitFork} label="Open PRs" value={String(project.openPullRequests)} />
        <RepoMetric icon={ShieldEllipsis} label="Team" value={project.owner} />
      </div>

      <div className="mt-5 flex items-center justify-between rounded-[1.25rem] border border-white/8 bg-black/30 px-4 py-3">
        <p className="text-sm text-zinc-300">Recommended first-wave import for the dashboard graph.</p>
        <Button size="sm">
          Import
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function RepoMetric({
  icon: Icon,
  label,
  value
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.2rem] border border-white/8 bg-white/[0.03] p-3">
      <div className="flex items-center gap-2 text-zinc-400">
        <Icon className="h-4 w-4" />
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-3 text-sm font-medium text-white">{value}</p>
    </div>
  );
}
