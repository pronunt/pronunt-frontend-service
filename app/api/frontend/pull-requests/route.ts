import { proxyWithSession } from "@/lib/backend/proxy";

export async function GET(request: Request) {
  const response = await proxyWithSession(
    request.url,
    "/api/v1/aggregator/prs?limit=50&offset=0&sort_by=priority_score&sort_direction=desc"
  );
  const body = await response.text();

  return new Response(body, {
    status: response.status,
    headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json" }
  });
}

