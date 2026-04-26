import { DashboardSectionHeading } from "@/components/dashboard/dashboard-section-heading";
import { RepositoryConfigEditor } from "@/components/dashboard/repository-config-editor";

export default function DashboardConfigPage() {
  return (
    <div className="space-y-8">
      <DashboardSectionHeading
        eyebrow="Config"
        title="Edit the service config"
        description="Inspect and update the tracked repository metadata that feeds ownership, criticality, and review context."
      />

      <section className="panel rounded-[2rem] p-6 sm:p-8">
        <RepositoryConfigEditor />
      </section>
    </div>
  );
}
