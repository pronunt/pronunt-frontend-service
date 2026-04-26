import { serviceOrigins } from "@/lib/backend/service-origins";
import { proxyWithSession } from "@/lib/backend/proxy";
import { enforceSessionCooldown, invalidateSessionCache } from "@/lib/backend/request-control";

type ImportRequest = {
  owner: string;
  name: string;
  full_name: string;
  private: boolean;
  default_branch: string;
  html_url: string;
};

function buildDisplayName(repositoryName: string) {
  return repositoryName
    .replace(/^pronunt-/i, "")
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function POST(request: Request) {
  const payload = (await request.json()) as ImportRequest;
  const cooldown = await enforceSessionCooldown(`import-repo:${payload.full_name}`, 6_000);
  if (cooldown) {
    return cooldown;
  }

  const configResponse = await proxyWithSession(serviceOrigins.config, "/api/v1/config/services", {
    body: JSON.stringify({
      service_name: payload.name,
      repository_full_name: payload.full_name,
      display_name: buildDisplayName(payload.name) || payload.name,
      description: `Imported from ${payload.full_name} for centralized pull request review.`,
      criticality: "medium",
      owners: [payload.owner],
      tags: ["github", payload.private ? "private" : "public", payload.default_branch]
    }),
    method: "POST"
  });

  if (!configResponse.ok) {
    const configBody = await configResponse.text();
    return new Response(configBody, {
      status: configResponse.status,
      headers: { "Content-Type": configResponse.headers.get("Content-Type") ?? "application/json" }
    });
  }

  const ingestionResponse = await proxyWithSession(
    serviceOrigins.ingestion,
    `/api/v1/ingestion/github/repos/${payload.owner}/${payload.name}/pull-requests/sync`,
    {
      body: JSON.stringify({}),
      method: "POST"
    }
  );
  const body = await ingestionResponse.text();

  if (ingestionResponse.ok) {
    await invalidateSessionCache(["config-services", "aggregator-prs", "aggregator-pr"]);
  }

  return new Response(body, {
    status: ingestionResponse.status,
    headers: { "Content-Type": ingestionResponse.headers.get("Content-Type") ?? "application/json" }
  });
}
