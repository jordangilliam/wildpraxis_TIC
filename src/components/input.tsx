import * as React from "react";
import { cn } from "@/utils";
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn("w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500/50", className)} {...props} />
  )
);
Input.displayName = "Input";
