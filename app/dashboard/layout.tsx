import { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

export default async function DashboardLayout({
  children
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    redirect("/");
  }

  const headerStore = await headers();
  const forwardedProto = headerStore.get("x-forwarded-proto") ?? "https";
  const host = headerStore.get("host");

  if (!host) {
    redirect("/");
  }

  const response = await fetch(`${forwardedProto}://${host}/api/frontend/session-status`, {
    cache: "no-store",
    headers: {
      Cookie: `${SESSION_COOKIE_NAME}=${sessionToken}`
    }
  });

  if (!response.ok) {
    redirect("/");
  }

  return <DashboardShell>{children}</DashboardShell>;
}
