import { Github, GitPullRequestArrow, ShieldCheck, Sparkles } from "lucide-react";

import { DashboardSectionHeading } from "@/components/dashboard/dashboard-section-heading";
import { ImportRepoCard } from "@/components/dashboard/import-repo-card";
import { Button } from "@/components/ui/button";
import { importableProjects } from "@/lib/mock-data";

const trustSignals = [
  {
    title: "Import only what matters",
    description: "Bring in just the repos your team wants to monitor, then let config-service map the graph.",
    icon: Github
  },
  {
    title: "GitOps-friendly onboarding",
    description: "Projects flow into the dashboard without changing your protected branch and PR workflow.",
    icon: ShieldCheck
  },
  {
    title: "AI remains optional",
    description: "Summaries are attached only when requested, with in-house routing as the default path.",
    icon: Sparkles
  }
];

export default function ImportPage() {
  return (
    <div className="space-y-8">
      <section className="panel overflow-hidden rounded-[2rem] p-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <DashboardSectionHeading
              eyebrow="Import"
              title="Import your GitHub projects"
              description="Choose repositories the way SonarQube onboarding feels lightweight: one clear step, then the dashboard starts making the graph visible."
            />

            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="lg">
                <Github className="mr-2 h-4 w-4" />
                Continue with GitHub
              </Button>
              <Button variant="ghost" size="lg">
                <GitPullRequestArrow className="mr-2 h-4 w-4" />
                Preview import plan
              </Button>
            </div>
          </div>

          <div className="grid gap-3">
            {trustSignals.map((signal) => {
              const Icon = signal.icon;
              return (
                <div
                  key={signal.title}
                  className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl border border-white/10 bg-black/40 p-2 text-zinc-100">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white">{signal.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-zinc-400">{signal.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <DashboardSectionHeading
          eyebrow="Repositories"
          title="Suggested imports"
          description="Start with core services, then bring in the rest of the graph once the first review loop is live."
        />

        <div className="grid gap-4 xl:grid-cols-2">
          {importableProjects.map((project) => (
            <ImportRepoCard key={project.name} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}
