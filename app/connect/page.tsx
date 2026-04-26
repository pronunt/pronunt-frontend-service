import { BrandMark } from "@/components/brand/brand-mark";
import { OrbitScene } from "@/components/marketing/orbit-scene";
import { ConnectSessionCallback } from "@/components/onboarding/connect-session-callback";
import { GithubConnectPanel } from "@/components/onboarding/github-connect-panel";

export default async function ConnectPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const sessionToken = resolvedSearchParams.session_token;

  return (
    <main className="noise-overlay relative overflow-hidden">
      <div className="absolute inset-x-0 top-[-12rem] h-[24rem] rounded-full bg-white/7 blur-3xl" />

      <section className="mx-auto min-h-screen max-w-7xl px-6 py-10 lg:px-10">
        <div className="mb-8">
          <BrandMark />
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          {typeof sessionToken === "string" && sessionToken.length > 0 ? (
            <ConnectSessionCallback sessionToken={sessionToken} />
          ) : (
            <GithubConnectPanel />
          )}
          <OrbitScene />
        </div>
      </section>
    </main>
  );
}
