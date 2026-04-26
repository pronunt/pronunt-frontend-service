import { serviceOrigins } from "@/lib/backend/service-origins";
import { proxyWithSession } from "@/lib/backend/proxy";
import { withSessionCache } from "@/lib/backend/request-control";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withSessionCache(
    `aggregator-pr:${id}`,
    6_000,
    () =>
      proxyWithSession(
        serviceOrigins.aggregator,
        `/api/v1/aggregator/prs/${id}`
      )
  );
}
