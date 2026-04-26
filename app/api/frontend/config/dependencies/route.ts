import { serviceOrigins } from "@/lib/backend/service-origins";
import { proxyWithSession } from "@/lib/backend/proxy";

export async function POST(request: Request) {
  const payload = await request.text();
  const response = await proxyWithSession(serviceOrigins.config, "/api/v1/config/dependencies", {
    body: payload,
    headers: { "Content-Type": "application/json" },
    method: "POST"
  });
  const body = await response.text();

  return new Response(body, {
    status: response.status,
    headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json" }
  });
}
