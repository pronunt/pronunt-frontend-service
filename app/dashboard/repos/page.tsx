import { DashboardSectionHeading } from "@/components/dashboard/dashboard-section-heading";
import { SelectedRepositoryList } from "@/components/dashboard/selected-repository-list";

export default function DashboardRepositoriesPage() {
  return (
    <div className="space-y-8">
      <DashboardSectionHeading
        eyebrow="Repositories"
        title="Repositories already in orbit"
        description="Review the repositories that are already part of your Pronunt intake graph."
      />

      <section className="panel rounded-[2rem] p-6 sm:p-8">
        <SelectedRepositoryList />
      </section>
    </div>
  );
}
