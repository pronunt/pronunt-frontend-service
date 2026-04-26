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
  impact_details: Array<{
    service_name: string;
    relationship: string;
    path: string[];
    explanation: string;
  }>;
  ai_summary?: string | null;
  html_url?: string | null;
};

export type PullRequestListResponse = {
  items: PullRequestItem[];
  total: number;
};
