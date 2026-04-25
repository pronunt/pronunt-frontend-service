import { Bot, FolderGit2, Radar, ShieldCheck } from "lucide-react";

export type PullRequestView = {
  id: string;
  repository: string;
  number: number;
  title: string;
  author: string;
  reviewStatus: string;
  riskScore: number;
  priorityScore: number;
  summary: string;
  impactSummary: string;
  impactExplanation: string;
};

export type ImportableProject = {
  name: string;
  repository: string;
  description: string;
  criticality: string;
  dependencies: number;
  openPullRequests: number;
  owner: string;
};

export const dashboardMetrics = [
  {
    label: "Open pull requests",
    value: "42",
    detail: "Across connected repos, with deterministic scoring and queue-backed ingestion already live.",
    icon: FolderGit2
  },
  {
    label: "High-risk review queue",
    value: "9",
    detail: "Critical repos stay elevated when size, churn, and dependency reach all move together.",
    icon: ShieldCheck
  },
  {
    label: "Impact surfaces",
    value: "14",
    detail: "Dependency graph explanations now show which services are affected and why.",
    icon: Radar
  },
  {
    label: "AI-ready summaries",
    value: "7",
    detail: "In-house by default, opt-out only when teams want a different destination.",
    icon: Bot
  }
];

export const pullRequests: PullRequestView[] = [
  {
    id: "303",
    repository: "pronunt-aggregator-service",
    number: 303,
    title: "Impact explanation validation",
    author: "sowrabh0-0",
    reviewStatus: "Awaiting review",
    riskScore: 41,
    priorityScore: 64,
    summary:
      "A compact backend change with moderate churn, but elevated priority because it influences the review graph for downstream services.",
    impactSummary:
      "pronunt-aggregator-service depends on 0 services and has 2 downstream impacted services.",
    impactExplanation:
      "pronunt-frontend-service is impacted because it depends on pronunt-worker-service, which depends on pronunt-aggregator-service."
  },
  {
    id: "202",
    repository: "pronunt-aggregator-service",
    number: 202,
    title: "Queue-backed PR flow",
    author: "kubepod404",
    reviewStatus: "Ready for summary",
    riskScore: 46,
    priorityScore: 60,
    summary:
      "This change validated the queue path and brought ingestion, worker, and aggregator into one working runtime backbone.",
    impactSummary:
      "Queue-backed updates can propagate into worker and frontend review surfaces without bypassing service contracts.",
    impactExplanation:
      "pronunt-worker-service is impacted because it directly depends on pronunt-aggregator-service."
  }
];

export const importableProjects: ImportableProject[] = [
  {
    name: "Aggregator Service",
    repository: "pronunt/pronunt-aggregator-service",
    description:
      "Core scoring and impact logic. Start here so the dashboard reflects real domain behavior immediately.",
    criticality: "critical",
    dependencies: 2,
    openPullRequests: 3,
    owner: "platform"
  },
  {
    name: "Worker Service",
    repository: "pronunt/pronunt-worker-service",
    description:
      "Queue consumer and normalization layer. Import next to expose the full ingestion-to-review path.",
    criticality: "high",
    dependencies: 2,
    openPullRequests: 4,
    owner: "platform"
  },
  {
    name: "AI Service",
    repository: "pronunt/pronunt-ai-service",
    description:
      "Prompt-owned summary layer with in-house default routing and provider override support.",
    criticality: "high",
    dependencies: 1,
    openPullRequests: 2,
    owner: "ai"
  },
  {
    name: "Frontend Service",
    repository: "pronunt/pronunt-frontend-service",
    description:
      "Monochrome review console, import workflow, and operator-facing decision surface.",
    criticality: "medium",
    dependencies: 3,
    openPullRequests: 1,
    owner: "ui"
  }
];
