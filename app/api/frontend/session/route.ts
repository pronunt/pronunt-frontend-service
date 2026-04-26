import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const sessionToken =
    body && typeof body.sessionToken === "string" ? body.sessionToken : "";

  if (!sessionToken) {
    return NextResponse.json(
      { code: "invalid_session_token", message: "Session token is required." },
      { status: 400 }
    );
  }

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24,
    path: "/",
    sameSite: "lax",
    secure: true
  });

  return NextResponse.json({ status: "ok" });
}
