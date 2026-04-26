"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const logout = () => {
    startTransition(async () => {
      await fetch("/api/frontend/logout", {
        method: "POST"
      }).catch(() => null);

      router.replace("/");
      router.refresh();
    });
  };

  return (
    <Button type="button" variant="ghost" size="sm" onClick={logout} disabled={isPending}>
      <LogOut className="mr-2 h-4 w-4" />
      {isPending ? "Signing out..." : "Logout"}
    </Button>
  );
}
