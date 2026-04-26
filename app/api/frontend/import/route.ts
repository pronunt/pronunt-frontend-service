import { serviceOrigins } from "@/lib/backend/service-origins";
import { proxyWithSession } from "@/lib/backend/proxy";

type ImportRequest = {
  owner: string;
  name: string;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as ImportRequest;
  const response = await proxyWithSession(
    serviceOrigins.ingestion,
    `/api/v1/ingestion/github/repos/${payload.owner}/${payload.name}/pull-requests/sync`,
    {
      body: JSON.stringify({}),
      method: "POST"
    }
  );
  const body = await response.text();

  return new Response(body, {
    status: response.status,
    headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json" }
  });
}
