import Link from "next/link";
import { ArrowRight, Bot, FolderGit2, Radar, Sparkles } from "lucide-react";

import { DashboardSectionHeading } from "@/components/dashboard/dashboard-section-heading";
import { PullRequestCard } from "@/components/dashboard/pull-request-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { dashboardMetrics, pullRequests } from "@/lib/mock-data";

const quickActions = [
  {
    title: "Import repositories",
    description: "Connect GitHub repos and start building your review graph.",
    href: "/dashboard/import",
    icon: FolderGit2
  },
  {
    title: "Trigger AI summary",
    description: "Generate in-house summaries on demand and keep prompts controlled.",
    href: "/dashboard/import",
    icon: Bot
  },
  {
    title: "Inspect impact graph",
    description: "See exactly which services are downstream before you review.",
    href: "/dashboard/import",
    icon: Radar
  }
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <DashboardSectionHeading
        eyebrow="Dashboard"
        title="Review field"
        description="Monitor priority, impact, and AI-assisted summaries from one monochrome surface."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="panel rounded-[2rem] p-5">
          <div className="mb-5 flex items-center justify-between">
            <DashboardSectionHeading
              eyebrow="Prioritized"
              title="Current pull requests"
              description="Deterministic scoring stays first. AI is attached only when you ask for it."
            />
            <Button asChild variant="ghost">
              <Link href="/dashboard/import">
                Import more
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
            {pullRequests.map((pullRequest) => (
              <PullRequestCard key={pullRequest.id} pullRequest={pullRequest} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="panel rounded-[2rem] p-5">
            <DashboardSectionHeading
              eyebrow="Highlights"
              title="What changed"
              description="The platform keeps impact explanation and AI destinations visible instead of buried in settings."
            />

            <div className="mt-5 space-y-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.title}
                    href={action.href}
                    className="block rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4 transition hover:bg-white/[0.06]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-2xl border border-white/10 bg-black/40 p-2 text-zinc-100">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-white">{action.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-zinc-400">{action.description}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="panel rounded-[2rem] p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2 text-zinc-100">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="mono text-[11px] uppercase tracking-[0.24em] text-zinc-500">AI route</p>
                <h3 className="mt-1 text-base font-medium text-white">In-house is default</h3>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-zinc-400">
              Your prompts remain fixed inside Pronunt. Teams can stay on the in-house Ollama route by
              default and only opt out when they really need an external model.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
