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
  default: "h-11 px-5 text-sm",
  sm: "h-9 px-4 text-sm",
  lg: "h-12 px-6 text-sm"
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
    "inline-flex items-center justify-center rounded-full font-medium transition duration-200",
    sizeClasses[size],
    variantClasses[variant],
    className
  );

  return <Comp className={classes} {...props} />;
}
