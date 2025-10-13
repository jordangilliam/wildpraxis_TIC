import * as React from "react";
type Props = { checked?: boolean; onCheckedChange?: (v: boolean) => void } & React.HTMLAttributes<HTMLButtonElement>;
export function Switch({ checked=false, onCheckedChange, ...props }: Props) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange && onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? "bg-sky-600" : "bg-slate-300"}`}
      {...props}
    >
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${checked ? "translate-x-5" : "translate-x-1"}`} />
    </button>
  );
}
