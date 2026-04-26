import type { ServiceConfigListResponse } from "@/lib/api-types";
import { serviceOrigins } from "@/lib/backend/service-origins";
import { proxyWithSession } from "@/lib/backend/proxy";
import { enforceSessionCooldown, invalidateSessionCache } from "@/lib/backend/request-control";

export async function POST() {
  const cooldown = await enforceSessionCooldown("refresh-orbit-prs", 10_000);
  if (cooldown) {
    return cooldown;
  }

  const configResponse = await proxyWithSession(serviceOrigins.config, "/api/v1/config/services");

  if (!configResponse.ok) {
    const body = await configResponse.text();
    return new Response(body, {
      status: configResponse.status,
      headers: { "Content-Type": configResponse.headers.get("Content-Type") ?? "application/json" }
    });
  }

  const configPayload = (await configResponse.json()) as ServiceConfigListResponse;
  const repositories = configPayload.items
    .map((item) => item.repository_full_name)
    .map((fullName) => fullName.split("/"))
    .filter((parts) => parts.length === 2 && parts[0] && parts[1]);

  const syncResults = await Promise.all(
    repositories.map(async ([owner, name]) => {
      const syncResponse = await proxyWithSession(
        serviceOrigins.ingestion,
        `/api/v1/ingestion/github/repos/${owner}/${name}/pull-requests/sync`,
        {
          body: JSON.stringify({}),
          method: "POST"
        }
      );

      const rawBody = await syncResponse.text();
      let parsedBody: Record<string, unknown> | null = null;

      try {
        parsedBody = rawBody ? (JSON.parse(rawBody) as Record<string, unknown>) : null;
      } catch {
        parsedBody = null;
      }

      return {
        repository_full_name: `${owner}/${name}`,
        ok: syncResponse.ok,
        status: syncResponse.status,
        queued_pull_requests:
          typeof parsedBody?.queued_pull_requests === "number" ? parsedBody.queued_pull_requests : 0
      };
    })
  );

  const queuedPullRequests = syncResults.reduce((total, item) => total + item.queued_pull_requests, 0);
  const failed = syncResults.filter((item) => !item.ok);

  if (failed.length === 0) {
    await invalidateSessionCache(["aggregator-prs", "aggregator-pr"]);
  }

  return Response.json(
    {
      repositories_synced: syncResults.length,
      queued_pull_requests: queuedPullRequests,
      failures: failed
    },
    {
      status: failed.length > 0 ? 207 : 200
    }
  );
}
