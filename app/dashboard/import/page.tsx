import { DashboardSectionHeading } from "@/components/dashboard/dashboard-section-heading";
import { RepositoryImportView } from "@/components/dashboard/repository-import-view";

export default function ImportPage() {
  return (
    <div className="space-y-8 overflow-x-hidden">
      <DashboardSectionHeading
        eyebrow="Import"
        title="Choose the repositories for first orbit"
        description="Select the repositories that should start feeding pull requests into Pronunt."
      />

      <section className="panel overflow-hidden rounded-[2rem] p-6 sm:p-8">
        <RepositoryImportView />
      </section>
    </div>
  );
}
