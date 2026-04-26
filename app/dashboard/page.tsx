import { CheckCircle2 } from "lucide-react";

import { DashboardSectionHeading } from "@/components/dashboard/dashboard-section-heading";
import { DashboardOverviewState } from "@/components/dashboard/dashboard-overview-state";
import { PullRequestFeed } from "@/components/dashboard/pull-request-feed";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <DashboardSectionHeading
        eyebrow="Dashboard"
        title="Cockpit is ready for repository intake"
        description="Your GitHub session is active. Choose the first repositories and Pronunt will start centralizing pull requests here."
      />

      <DashboardOverviewState />

      <section className="panel rounded-[2rem] p-6 sm:p-8">
        <div className="space-y-4">
          <DashboardSectionHeading
            eyebrow="Readiness"
            title="What appears after repository intake"
            description="Once the repos are selected, this cockpit will fill with deterministic priority, dependency impact, and in-house AI summaries."
          />

          <div className="grid gap-4 md:grid-cols-3">
            {[
              "Repository health and ownership",
              "Cross-service impact paths",
              "Review summaries and risk signals"
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-white/8 bg-black/30 p-4"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-zinc-100" />
                  <p className="text-sm leading-6 text-zinc-300">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel rounded-[2rem] p-6 sm:p-8">
        <PullRequestFeed />
      </section>
    </div>
  );
}
