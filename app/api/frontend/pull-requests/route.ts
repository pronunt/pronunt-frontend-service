import { serviceOrigins } from "@/lib/backend/service-origins";
import { proxyWithSession } from "@/lib/backend/proxy";
import { withSessionCache } from "@/lib/backend/request-control";

export async function GET() {
  return withSessionCache("aggregator-prs", 6_000, () =>
    proxyWithSession(
      serviceOrigins.aggregator,
      "/api/v1/aggregator/prs?limit=50&offset=0&sort_by=priority_score&sort_direction=desc"
    )
  );
}
