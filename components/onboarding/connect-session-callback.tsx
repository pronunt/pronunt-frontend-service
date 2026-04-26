"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function ConnectSessionCallback({
  sessionToken
}: {
  sessionToken: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function persistSession() {
      const response = await fetch("/api/frontend/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ sessionToken })
      });

      if (!response.ok) {
        throw new Error("Failed to persist GitHub session.");
      }

      if (!cancelled) {
        router.replace("/dashboard");
      }
    }

    persistSession().catch((caughtError) => {
      if (!cancelled) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Failed to finish GitHub connection."
        );
      }
    });

    return () => {
      cancelled = true;
    };
  }, [router, sessionToken]);

  if (error) {
    return (
      <div className="panel rounded-[2rem] p-6 text-sm text-red-300">
        {error}
      </div>
    );
  }

  return (
    <div className="panel rounded-[2rem] p-6 text-sm text-zinc-300">
      Finalizing your GitHub connection...
    </div>
  );
}
