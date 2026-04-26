import { cookies } from "next/headers";

import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

export async function getSessionTokenFromCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
}

export async function proxyWithSession(
  requestUrl: string,
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

  const origin = new URL(requestUrl).origin;
  const headers = new Headers(init.headers ?? {});
  headers.set("Accept", "application/json");
  headers.set("Authorization", `Bearer ${sessionToken}`);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${origin}${path}`, {
    ...init,
    headers,
    cache: "no-store"
  });

  return response;
}

