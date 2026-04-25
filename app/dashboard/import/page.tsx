import { DashboardSectionHeading } from "@/components/dashboard/dashboard-section-heading";
import { GithubConnectPanel } from "@/components/onboarding/github-connect-panel";

export default function ImportPage() {
  return (
    <div className="space-y-8">
      <DashboardSectionHeading
        eyebrow="Connection"
        title="GitHub not connected yet"
        description="Keep the dashboard empty until the account handshake is complete."
      />

      <GithubConnectPanel compact />
    </div>
  );
}
