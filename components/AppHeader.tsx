import Link from "next/link";
import { Leaf } from "lucide-react";

const nav = [
  { href: "/image", label: "图片关键词" },
  { href: "/reverse", label: "图片反推" },
  { href: "/video", label: "视频关键词" }
];

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#6b8f73]/15 bg-[#fff8de]/85 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/image" className="flex items-center gap-3 font-extrabold tracking-tight text-[#31504a]">
          <span className="grid size-9 place-items-center rounded-[14px] border border-[#31504a]/10 bg-[#4f9b63] text-white shadow-[0_4px_0_rgba(49,80,74,.18)]">
            <Leaf size={18} />
          </span>
          <span className="rounded-full bg-[#ffe9a8] px-3 py-1 shadow-[inset_0_-2px_0_rgba(141,90,52,.16)]">Prompt Studio</span>
        </Link>
        <nav className="flex gap-1 rounded-full border border-[#8d5a34]/20 bg-white/75 p-1 shadow-card">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-full px-3 py-2 text-sm font-semibold text-[#687c72] transition hover:bg-[#f27964] hover:text-white sm:px-4">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
