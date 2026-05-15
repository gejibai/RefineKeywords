"use client";

import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "dark";

export function Button({ className, variant = "secondary", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const variants: Record<Variant, string> = {
    primary: "bg-[#0071e3] text-white shadow-[0_8px_18px_rgba(0,113,227,.25)] hover:bg-[#0067d1]",
    secondary: "bg-[#f2f2f4] text-[#1d1d1f] hover:bg-white",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    dark: "bg-[#1d1d1f] text-white hover:bg-black"
  };
  return (
    <button
      className={cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55", variants[variant], className)}
      {...props}
    />
  );
}
