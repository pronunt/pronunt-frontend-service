"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

export function ConnectSessionBridge() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const sessionToken = searchParams.get("session_token");
    const status = searchParams.get("status");

    if (!sessionToken) {
      return;
    }

    const secureAttribute = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${SESSION_COOKIE_NAME}=${encodeURIComponent(sessionToken)}; Path=/; Max-Age=86400; SameSite=Lax${secureAttribute}`;

    if (status === "connected") {
      router.replace("/dashboard");
      return;
    }

    router.replace("/dashboard");
  }, [router, searchParams]);

  return null;
}

