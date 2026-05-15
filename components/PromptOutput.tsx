"use client";

import { Download, FileJson } from "lucide-react";
import { Button } from "./Button";
import { CopyButton } from "./CopyButton";

type Tab = { id: string; label: string; content: string; mono?: boolean };

function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function PromptOutput({ title, tabs, active, onActiveChange, baseName }: { title: string; tabs: Tab[]; active: string; onActiveChange: (id: string) => void; baseName: string }) {
  const selected = tabs.find((tab) => tab.id === active) ?? tabs[0];
  const jsonTab = tabs.find((tab) => tab.id.includes("json"));
  return (
    <aside className="sticky top-24 rounded-[28px] border border-white bg-white/95 p-5 shadow-soft lg:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-extrabold tracking-tight">{title}</h2>
      </div>
      <div className="mb-4 flex rounded-full bg-[#f2f2f4] p-1">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => onActiveChange(tab.id)} className={`flex-1 rounded-full px-3 py-2 text-xs font-bold transition ${active === tab.id ? "bg-white text-[#1d1d1f] shadow-card" : "text-[#6e6e73]"}`}>
            {tab.label}
          </button>
        ))}
      </div>
      <pre className={`min-h-[360px] max-h-[580px] overflow-auto whitespace-pre-wrap break-words rounded-3xl border border-black/10 bg-[#fbfbfd] p-4 text-sm leading-7 ${selected.mono ? "font-mono text-xs" : "font-sans"}`}>
        {selected.content}
      </pre>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <CopyButton text={selected.content} label="复制当前" />
        <Button onClick={() => download(`${baseName}.txt`, tabs.map((tab) => `【${tab.label}】\n${tab.content}`).join("\n\n"), "text/plain;charset=utf-8")}>
          <Download size={16} />
          导出 TXT
        </Button>
        {jsonTab ? (
          <Button className="sm:col-span-2" variant="dark" onClick={() => download(`${baseName}.json`, jsonTab.content, "application/json;charset=utf-8")}>
            <FileJson size={16} />
            导出 JSON
          </Button>
        ) : null}
      </div>
    </aside>
  );
}
