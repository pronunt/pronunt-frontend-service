import { serviceOrigins } from "@/lib/backend/service-origins";
import { proxyWithSession } from "@/lib/backend/proxy";
import { enforceSessionCooldown, invalidateSessionCache } from "@/lib/backend/request-control";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cooldown = await enforceSessionCooldown(`generate-insights:${id}`, 8_000);
  if (cooldown) {
    return cooldown;
  }

  const body = await request.text();

  const response = await proxyWithSession(
    serviceOrigins.aggregator,
    `/api/v1/aggregator/prs/${id}/summary`,
    {
      method: "POST",
      body: body || undefined
    }
  );

  const payload = await response.text();

  if (response.ok) {
    await invalidateSessionCache(["aggregator-prs", "aggregator-pr"]);
  }

  return new Response(payload, {
    status: response.status,
    headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json" }
  });
}
