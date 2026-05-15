"use client";

import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "dark";

export function Button({ className, variant = "secondary", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const variants: Record<Variant, string> = {
    primary: "bg-[#4f9b63] text-white shadow-[0_5px_0_rgba(49,80,74,.2)] hover:bg-[#438956]",
    secondary: "border border-[#8d5a34]/20 bg-[#fff8de] text-[#31504a] shadow-[inset_0_-2px_0_rgba(141,90,52,.13)] hover:bg-white",
    danger: "bg-[#fff0ec] text-[#cf5140] hover:bg-[#ffe3dc]",
    dark: "bg-[#31504a] text-white shadow-[0_5px_0_rgba(49,80,74,.22)] hover:bg-[#223b36]"
  };
  return (
    <button
      className={cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55", variants[variant], className)}
      {...props}
    />
  );
}
