import { serviceOrigins } from "@/lib/backend/service-origins";
import { proxyWithSession } from "@/lib/backend/proxy";
import {
  enforceSessionCooldown,
  invalidateSessionCache,
  withSessionCache
} from "@/lib/backend/request-control";

export async function GET() {
  return withSessionCache("config-services", 8_000, () =>
    proxyWithSession(serviceOrigins.config, "/api/v1/config/services")
  );
}

export async function POST(request: Request) {
  const cooldown = await enforceSessionCooldown("save-service-config", 2_500);
  if (cooldown) {
    return cooldown;
  }

  const payload = await request.text();
  const response = await proxyWithSession(serviceOrigins.config, "/api/v1/config/services", {
    body: payload,
    headers: { "Content-Type": "application/json" },
    method: "POST"
  });
  const body = await response.text();

  if (response.ok) {
    await invalidateSessionCache(["config-services", "aggregator-prs", "aggregator-pr", "config-impact", "orbit-repos"]);
  }

  return new Response(body, {
    status: response.status,
    headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json" }
  });
}
