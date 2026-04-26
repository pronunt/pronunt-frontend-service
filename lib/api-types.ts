export type ConnectedRepository = {
  id: number;
  full_name: string;
  owner: string;
  name: string;
  private: boolean;
  default_branch: string;
  html_url: string;
  installation_hint: string;
};

export type ConnectedRepositoryListResponse = {
  items: ConnectedRepository[];
  total: number;
};

export type ServiceCriticality = "low" | "medium" | "high" | "critical";

export type ServiceConfig = {
  id: string;
  service_name: string;
  repository_full_name: string;
  display_name: string;
  description?: string | null;
  criticality: ServiceCriticality;
  owners: string[];
  tags: string[];
};

export type ServiceConfigListResponse = {
  items: ServiceConfig[];
  total: number;
};

export type DependencyGraphItem = {
  service_name: string;
  depends_on: string[];
};

export type ImpactDetail = {
  service_name: string;
  relationship: string;
  path: string[];
  explanation: string;
};

export type ImpactResponse = {
  service_name: string;
  direct_dependencies: string[];
  downstream_services: string[];
  impact_summary: string;
  impact_details: ImpactDetail[];
};

export type PullRequestItem = {
  id: string;
  repository_full_name: string;
  repository_name: string;
  number: number;
  title: string;
  author_username: string;
  review_status: string;
  risk_score: number;
  priority_score: number;
  impact_summary: string;
  impact_details: ImpactDetail[];
  ai_summary?: string | null;
  html_url?: string | null;
};

export type PullRequestListResponse = {
  items: PullRequestItem[];
  total: number;
};

export type PullRequestSummaryResponse = {
  id: string;
  pr_uid: string;
  ai_summary: string;
  generated_by: string;
  model: string;
};
