import { DashboardSectionHeading } from "@/components/dashboard/dashboard-section-heading";
import { PullRequestFeed } from "@/components/dashboard/pull-request-feed";

export default function DashboardPullRequestsPage() {
  return (
    <div className="space-y-8">
      <DashboardSectionHeading
        eyebrow="Pull Requests"
        title="Centralized pull request cockpit"
        description="Every imported repository sends its open pull requests into this shared review surface."
      />

      <section className="panel rounded-[2rem] p-6 sm:p-8">
        <PullRequestFeed />
      </section>
    </div>
  );
}
