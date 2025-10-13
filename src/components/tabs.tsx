import * as React from "react";

type Ctx = { value: string; setValue: (v: string) => void };
const TabsCtx = React.createContext<Ctx | null>(null);

export function Tabs({ value, defaultValue, onValueChange, children, className }: { value?: string; defaultValue?: string; onValueChange?: (v: string) => void; children: React.ReactNode; className?: string }) {
  const [internalValue, setInternalValue] = React.useState(value || defaultValue || "");
  const currentValue = value !== undefined ? value : internalValue;
  const handleChange = (v: string) => {
    if (onValueChange) onValueChange(v);
    setInternalValue(v);
  };
  return <div className={className}><TabsCtx.Provider value={{ value: currentValue, setValue: handleChange }}>{children}</TabsCtx.Provider></div>;
}
export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`inline-flex gap-2 rounded-xl border bg-white p-1 ${className || ""}`}>{children}</div>;
}
export function TabsTrigger({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const ctx = React.useContext(TabsCtx)!;
  const active = ctx.value === value;
  return (
    <button onClick={() => ctx.setValue(value)} className={`px-3 py-2 rounded-lg text-sm ${active ? "bg-sky-600 text-white" : "bg-transparent hover:bg-slate-100"} ${className || ""}`}>
      {children}
    </button>
  );
}
export function TabsContent({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const ctx = React.useContext(TabsCtx)!;
  if (ctx.value !== value) return null;
  return <div className={className}>{children}</div>;
}
