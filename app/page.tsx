import Link from "next/link";
import { ArrowRight, Github } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand/brand-mark";

export default function HomePage() {
  return (
    <main className="noise-overlay relative min-h-screen overflow-hidden bg-black">
      <video
        className="absolute inset-0 h-full w-full object-cover object-center opacity-40 blur-[2px] scale-[1.04]"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/pronunt-hero-high-motion.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.18)_38%,rgba(0,0,0,0.82)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/78 via-black/22 to-black/58" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-transparent to-black/24" />

      <section className="relative flex min-h-screen flex-col px-6 py-6 lg:px-10 lg:py-8">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4">
          <div className="relative w-full max-w-[1120px]">
            <div className="absolute inset-0 rounded-[2.2rem] bg-white/[0.04] blur-3xl" />
            <div className="relative overflow-hidden rounded-[2.2rem] bg-black/12 shadow-[0_30px_120px_rgba(0,0,0,0.55)] backdrop-blur-[2px]">
              <video
                className="h-auto w-full object-contain"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="/pronunt-hero-high-motion.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>

        <div className="fade-up">
          <BrandMark />
        </div>

        <div className="flex-1" />

        <div className="fade-up-delay max-w-xl space-y-5 pb-6 lg:pb-10">
          <div className="mono inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/30 px-4 py-2 text-[11px] uppercase tracking-[0.32em] text-zinc-300 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-white/80" />
            PR Astronaut
          </div>

          <div className="space-y-3">
            <h1 className="max-w-lg text-balance text-4xl font-semibold leading-[0.96] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
              One astronaut. Every PR signal.
            </h1>
            <p className="max-w-md text-base leading-7 text-zinc-300 sm:text-lg">
              Pronunt explores your connected repositories, collects review context, and brings risk, impact, and summaries back to one cockpit.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="group">
              <Link href="/connect">
                <Github className="mr-2 h-4 w-4" />
                Continue with GitHub account
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <p className="mono text-[11px] uppercase tracking-[0.28em] text-zinc-500">
            Review intelligence for teams operating across many systems.
          </p>
        </div>
      </section>
    </main>
  );
}
