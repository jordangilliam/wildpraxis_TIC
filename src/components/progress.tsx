import * as React from "react";
export function Progress({ value=0, className="" }: { value?: number; className?: string }) {
  return (
    <div className={`w-full bg-slate-200 rounded-full ${className}`}>
      <div className="bg-sky-600 h-full rounded-full" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
