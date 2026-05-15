import { cn } from "@/lib/utils";

export function FieldGroup({ label, hint, children, className }: { label: string; hint?: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn("flex flex-col gap-2", className)}>
      <span className="text-sm font-black text-[#31504a]">{label}</span>
      {children}
      {hint ? <span className="text-xs leading-5 text-[#687c72]">{hint}</span> : null}
    </label>
  );
}

export const inputClass = "w-full rounded-2xl border border-[#8d5a34]/20 bg-[#fffdf3] px-4 py-3 text-sm text-[#31504a] outline-none transition placeholder:text-[#8aa094] focus:border-[#48a9b6]/70 focus:bg-white focus:ring-4 focus:ring-[#48a9b6]/15";
