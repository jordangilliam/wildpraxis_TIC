import * as React from "react";
import { cn } from "@/utils";

type Variant = "default" | "outline" | "ghost" | "destructive";
type Size = "sm" | "md";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const base = "inline-flex items-center justify-center rounded-2xl px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500/50";
const variants: Record<Variant, string> = {
  default: "bg-sky-600 text-white hover:bg-sky-700",
  outline: "border border-slate-300 hover:bg-slate-50",
  ghost: "hover:bg-slate-100",
  destructive: "bg-red-600 text-white hover:bg-red-700",
};
const sizes: Record<Size, string> = {
  sm: "text-sm px-3 py-2",
  md: "text-base px-4 py-2",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "sm", ...props }, ref) => (
    <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props} />
  )
);
Button.displayName = "Button";
