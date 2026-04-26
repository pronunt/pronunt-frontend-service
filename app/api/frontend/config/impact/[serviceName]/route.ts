import { serviceOrigins } from "@/lib/backend/service-origins";
import { proxyWithSession } from "@/lib/backend/proxy";

type Context = {
  params: Promise<{ serviceName: string }>;
};

export async function GET(_: Request, context: Context) {
  const params = await context.params;
  const serviceName = encodeURIComponent(params.serviceName);
  const response = await proxyWithSession(
    serviceOrigins.config,
    `/api/v1/config/impact/${serviceName}`
  );
  const body = await response.text();

  return new Response(body, {
    status: response.status,
    headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json" }
  });
}
