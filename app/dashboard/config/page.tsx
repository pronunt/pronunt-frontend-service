import { DashboardSectionHeading } from "@/components/dashboard/dashboard-section-heading";
import { RepositoryConfigEditor } from "@/components/dashboard/repository-config-editor";

export default function DashboardConfigPage() {
  return (
    <div className="space-y-8">
      <DashboardSectionHeading
        eyebrow="Config"
        title="Edit the repository graph"
        description="Inspect and update the tracked service config that feeds impact, ownership, and review context."
      />

      <section className="panel rounded-[2rem] p-6 sm:p-8">
        <RepositoryConfigEditor />
      </section>
    </div>
  );
}
