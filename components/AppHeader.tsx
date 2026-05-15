import Link from "next/link";
import { Sparkles } from "lucide-react";

const nav = [
  { href: "/image", label: "图片关键词" },
  { href: "/reverse", label: "图片反推" },
  { href: "/video", label: "视频关键词" }
];

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-[#f5f5f7]/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/image" className="flex items-center gap-3 font-extrabold tracking-tight">
          <span className="grid size-8 place-items-center rounded-xl bg-[#1d1d1f] text-white">
            <Sparkles size={17} />
          </span>
          <span>Prompt Studio</span>
        </Link>
        <nav className="flex gap-1 rounded-full border border-black/10 bg-white/70 p-1">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-full px-3 py-2 text-sm font-semibold text-[#6e6e73] transition hover:bg-white hover:text-[#1d1d1f] sm:px-4">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
