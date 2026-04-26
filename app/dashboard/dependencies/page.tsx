import { DashboardSectionHeading } from "@/components/dashboard/dashboard-section-heading";
import { DependencyGraphEditor } from "@/components/dashboard/dependency-graph-editor";

export default function DashboardDependenciesPage() {
  return (
    <div className="space-y-8">
      <DashboardSectionHeading
        eyebrow="Dependencies"
        title="Edit the dependency graph"
        description="Define the direct dependency edges that power impact summaries and downstream path analysis."
      />

      <section className="panel rounded-[2rem] p-6 sm:p-8">
        <DependencyGraphEditor />
      </section>
    </div>
  );
}
