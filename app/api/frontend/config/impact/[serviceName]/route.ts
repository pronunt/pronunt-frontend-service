import { serviceOrigins } from "@/lib/backend/service-origins";
import { proxyWithSession } from "@/lib/backend/proxy";
import { withSessionCache } from "@/lib/backend/request-control";

type Context = {
  params: Promise<{ serviceName: string }>;
};

export async function GET(_: Request, context: Context) {
  const params = await context.params;
  const serviceName = encodeURIComponent(params.serviceName);
  return withSessionCache(
    `config-impact:${serviceName}`,
    15_000,
    () =>
      proxyWithSession(
        serviceOrigins.config,
        `/api/v1/config/impact/${serviceName}`
      )
  );
}
