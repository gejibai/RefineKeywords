import { cn } from "@/lib/utils";

export function FieldGroup({ label, hint, children, className }: { label: string; hint?: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn("flex flex-col gap-2", className)}>
      <span className="text-sm font-bold text-[#333336]">{label}</span>
      {children}
      {hint ? <span className="text-xs leading-5 text-[#6e6e73]">{hint}</span> : null}
    </label>
  );
}

export const inputClass = "w-full rounded-2xl border border-black/10 bg-[#fbfbfd] px-4 py-3 text-sm outline-none transition focus:border-[#0071e3]/60 focus:bg-white focus:ring-4 focus:ring-[#0071e3]/10";
