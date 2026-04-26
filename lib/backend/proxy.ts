import { cookies } from "next/headers";

import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

export async function getSessionTokenFromCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
}

export async function proxyWithSession(
  serviceOrigin: string,
  path: string,
  init: RequestInit = {}
) {
  const sessionToken = await getSessionTokenFromCookie();

  if (!sessionToken) {
    return new Response(JSON.stringify({ code: "missing_session", message: "Session token is required." }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  const headers = new Headers(init.headers ?? {});
  headers.set("Accept", "application/json");
  headers.set("Authorization", `Bearer ${sessionToken}`);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${serviceOrigin}${path}`, {
    ...init,
    headers,
    cache: "no-store"
  });

  return response;
}

export async function validateSessionToken(sessionToken: string) {
  const headers = new Headers({
    Accept: "application/json",
    Authorization: `Bearer ${sessionToken}`
  });

  const response = await fetch(
    `${process.env.AUTH_SERVICE_URL?.trim() || "http://pronunt-auth-service:8000"}/api/v1/auth/me`,
    {
      cache: "no-store",
      headers
    }
  );

  return response.ok;
}
