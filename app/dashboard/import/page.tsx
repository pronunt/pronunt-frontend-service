import Link from "next/link";
import { FolderGit2, Github, Orbit, ShieldCheck } from "lucide-react";

import { DashboardSectionHeading } from "@/components/dashboard/dashboard-section-heading";
import { GithubConnectPanel } from "@/components/onboarding/github-connect-panel";
import { GitHubOAuthButton } from "@/components/onboarding/github-oauth-button";
import { RepositoryImportView } from "@/components/dashboard/repository-import-view";
import { Button } from "@/components/ui/button";

const placeholderRepos = [
  "Repository list will appear after GitHub authentication completes.",
  "Pronunt will let you choose only the services you want in the first review orbit.",
  "Nothing is imported automatically before you confirm the selection."
];

export default function ImportPage() {
  return (
    <div className="space-y-8">
      <DashboardSectionHeading
        eyebrow="Import"
        title="Choose repositories after the handshake"
        description="This page stays empty until GitHub is connected. Once the account is linked, repository selection belongs here."
      />

      <section className="grid gap-6 xl:grid-cols-[0.94fr_1.06fr]">
        <GithubConnectPanel compact />

        <div className="panel rounded-[2rem] p-6 sm:p-8">
          <div className="space-y-5">
            <div className="mono inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] uppercase tracking-[0.28em] text-zinc-400">
              <FolderGit2 className="h-3.5 w-3.5" />
              Repository selection
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
                The repo picker unlocks right after GitHub connects.
              </h2>
              <p className="text-base leading-7 text-zinc-400">
                We keep this surface intentionally empty until the handshake succeeds, so you only see real repositories from the connected account.
              </p>
            </div>

            <div className="grid gap-3">
              {placeholderRepos.map((item, index) => {
                const Icon = index === 0 ? Github : index === 1 ? Orbit : ShieldCheck;

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
              <Button asChild variant="ghost" size="lg" className="sm:min-w-[14rem]">
                <Link href="/connect">Open connect page</Link>
              </Button>
              <GitHubOAuthButton className="group sm:min-w-[14rem]" />
            </div>
          </div>
        </div>
      </section>

      <section className="panel rounded-[2rem] p-6 sm:p-8">
        <RepositoryImportView />
      </section>
    </div>
  );
}
