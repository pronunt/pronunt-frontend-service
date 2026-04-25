import { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

  return <DashboardShell>{children}</DashboardShell>;
}
