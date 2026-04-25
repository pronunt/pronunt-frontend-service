import { Slot } from "@radix-ui/react-slot";
import { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "ghost";
type ButtonSize = "default" | "sm" | "lg";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "min-h-11 px-5 py-3 text-sm",
  sm: "min-h-9 px-4 py-2.5 text-sm",
  lg: "min-h-12 px-6 py-3 text-sm"
};

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "border border-white/12 bg-white text-black hover:bg-zinc-200",
  ghost:
    "border border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.08]"
};

export function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  const classes = cn(
    "inline-flex shrink-0 items-center justify-center rounded-full font-medium leading-none whitespace-nowrap transition duration-200",
    sizeClasses[size],
    variantClasses[variant],
    className
  );

  return <Comp className={classes} {...props} />;
}
