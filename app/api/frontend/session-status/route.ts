import { proxyWithSession } from "@/lib/backend/proxy";

export async function GET(request: Request) {
  const response = await proxyWithSession(request.url, "/api/v1/auth/me");
  const body = await response.text();

  return new Response(body, {
    status: response.status,
    headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json" }
  });
}
