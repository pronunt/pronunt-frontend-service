import { serviceOrigins } from "@/lib/backend/service-origins";
import { proxyWithSession } from "@/lib/backend/proxy";
import { enforceSessionCooldown, invalidateSessionCache } from "@/lib/backend/request-control";

export async function POST(request: Request) {
  const cooldown = await enforceSessionCooldown("save-dependency-graph", 3_000);
  if (cooldown) {
    return cooldown;
  }

  const payload = await request.text();
  const response = await proxyWithSession(serviceOrigins.config, "/api/v1/config/dependencies", {
    body: payload,
    headers: { "Content-Type": "application/json" },
    method: "POST"
  });
  const body = await response.text();

  if (response.ok) {
    await invalidateSessionCache(["config-impact", "aggregator-prs", "aggregator-pr"]);
  }

  return new Response(body, {
    status: response.status,
    headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json" }
  });
}
