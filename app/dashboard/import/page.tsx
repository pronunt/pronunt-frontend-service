import Link from "next/link";
import { ArrowRight, CheckCircle2, FolderGit2, Orbit } from "lucide-react";

import { DashboardSectionHeading } from "@/components/dashboard/dashboard-section-heading";
import { RepositoryImportView } from "@/components/dashboard/repository-import-view";
import { SelectedRepositoryList } from "@/components/dashboard/selected-repository-list";
import { Button } from "@/components/ui/button";

const placeholderRepos = [
  "Your GitHub session is already active for this dashboard.",
  "Choose only the repositories you want in the first review orbit.",
  "Nothing is imported automatically until you confirm each repo."
];

export default function ImportPage() {
  return (
    <div className="space-y-8">
      <DashboardSectionHeading
        eyebrow="Import"
        title="Choose the repositories for first orbit"
        description="Select the repositories that should start feeding pull requests into Pronunt."
      />

      <section className="panel rounded-[2rem] p-6 sm:p-8">
        <RepositoryImportView />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <div className="panel rounded-[2rem] p-6 sm:p-8">
          <div className="space-y-5">
            <div className="mono inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] uppercase tracking-[0.28em] text-zinc-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              GitHub connected
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
                The cockpit is ready for repository intake.
              </h2>
              <p className="text-base leading-7 text-zinc-400">
                Pick the repositories that should feed pull request intelligence into this review surface first, then return to the dashboard to review everything in one place.
              </p>
            </div>

            <div className="grid gap-3">
              {placeholderRepos.map((item, index) => {
                const Icon = index === 0 ? CheckCircle2 : index === 1 ? FolderGit2 : Orbit;

                return (
                  <div
                    key={item}
                    className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-2xl border border-white/10 bg-black/40 p-2 text-zinc-100">
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className="text-sm leading-6 text-zinc-300">{item}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="group sm:min-w-[14rem]">
                <Link href="/dashboard/prs">
                  Review centralized PRs
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="sm:min-w-[14rem]">
                <Link href="/dashboard">Back to dashboard</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="panel rounded-[2rem] p-6 sm:p-8">
          <SelectedRepositoryList />
        </div>
      </section>
    </div>
  );
}
