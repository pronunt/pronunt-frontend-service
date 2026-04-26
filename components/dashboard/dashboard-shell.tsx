import Link from "next/link";
import { Code2, Github, LayoutDashboard, Sparkles, Waypoints } from "lucide-react";
import { ReactNode } from "react";

import { LogoutButton } from "@/components/dashboard/logout-button";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/import", label: "Import Projects", icon: Github },
  { href: "/dashboard/config", label: "Config Editor", icon: Code2 }
];

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <main className="noise-overlay min-h-screen px-4 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl gap-4 lg:grid-cols-[280px_1fr]">
        <aside className="panel rounded-[2rem] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] border border-white/10 bg-white/[0.04]">
              <Waypoints className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="mono text-[11px] uppercase tracking-[0.26em] text-zinc-500">Pronunt</p>
              <h1 className="mt-1 text-base font-medium text-white">PR Astronaut</h1>
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-[1.2rem] border border-transparent px-4 py-3 text-sm text-zinc-300 transition hover:border-white/8 hover:bg-white/[0.04] hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-[1.5rem] border border-white/8 bg-black/30 p-4">
            <p className="mono text-[11px] uppercase tracking-[0.26em] text-zinc-500">AI route</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2 text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">In-house default</p>
                <p className="text-sm text-zinc-400">Ollama / llama3.1:8b</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <LogoutButton />
          </div>
        </aside>

        <section className="panel rounded-[2rem] p-5 sm:p-7">{children}</section>
      </div>
    </main>
  );
}
