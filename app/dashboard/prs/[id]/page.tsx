import { DashboardSectionHeading } from "@/components/dashboard/dashboard-section-heading";
import { PullRequestDetailView } from "@/components/dashboard/pull-request-detail-view";

export default async function PullRequestDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-8">
      <DashboardSectionHeading
        eyebrow="Pull request"
        title="Review details"
        description="Open one pull request at a time to inspect impact, AI notes, and downstream context."
      />

      <PullRequestDetailView id={id} />
    </div>
  );
}
