"use client";

import { ReactNode, useState, useTransition } from "react";
import { ArrowRight, Github } from "lucide-react";

import { Button } from "@/components/ui/button";

type GitHubOAuthButtonProps = {
  children?: ReactNode;
  className?: string;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "ghost";
};

type GitHubLoginResponse = {
  redirect_url: string;
  state: string;
};

export function GitHubOAuthButton({
  children = "Continue with GitHub",
  className,
  size = "lg",
  variant = "default"
}: GitHubOAuthButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    startTransition(async () => {
      setError(null);

      try {
        const response = await fetch("/api/v1/auth/github/login", {
          headers: {
            Accept: "application/json"
          },
          method: "GET"
        });

        if (!response.ok) {
          throw new Error("Unable to start the GitHub handshake.");
        }

        const payload = (await response.json()) as GitHubLoginResponse;

        if (!payload.redirect_url) {
          throw new Error("GitHub redirect URL is missing.");
        }

        window.location.href = payload.redirect_url;
      } catch (caughtError) {
        const message =
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to start the GitHub handshake.";
        setError(message);
      }
    });
  };

  return (
    <div className="space-y-2">
      <Button
        type="button"
        size={size}
        variant={variant}
        className={className}
        onClick={handleClick}
        disabled={isPending}
      >
        <Github className="mr-2 h-4 w-4" />
        {isPending ? "Connecting GitHub..." : children}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}
    </div>
  );
}

