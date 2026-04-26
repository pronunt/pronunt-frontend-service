import { serviceOrigins } from "@/lib/backend/service-origins";
import { proxyWithSession } from "@/lib/backend/proxy";
import { withSessionCache } from "@/lib/backend/request-control";

export async function GET() {
  return withSessionCache("github-repos", 15_000, () =>
    proxyWithSession(serviceOrigins.auth, "/api/v1/auth/github/repos")
  );
}
