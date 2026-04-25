import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { BrandMark } from "@/components/brand/brand-mark";
import { OrbitScene } from "@/components/marketing/orbit-scene";
import { GithubConnectPanel } from "@/components/onboarding/github-connect-panel";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

export default async function ConnectPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const sessionToken = resolvedSearchParams.session_token;

  if (typeof sessionToken === "string" && sessionToken.length > 0) {
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      path: "/",
      sameSite: "lax",
      secure: true
    });

    redirect("/dashboard");
  }

  return (
    <main className="noise-overlay relative overflow-hidden">
      <div className="absolute inset-x-0 top-[-12rem] h-[24rem] rounded-full bg-white/7 blur-3xl" />

      <section className="mx-auto min-h-screen max-w-7xl px-6 py-10 lg:px-10">
        <div className="mb-8">
          <BrandMark />
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <GithubConnectPanel />
          <OrbitScene />
        </div>
      </section>
    </main>
  );
}
