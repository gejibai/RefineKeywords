"use client";

import { Copy } from "lucide-react";
import { Button } from "./Button";

export function CopyButton({ text, label = "复制" }: { text: string; label?: string }) {
  async function copy() {
    if (!text.trim()) return;
    await navigator.clipboard.writeText(text);
  }
  return (
    <Button variant="primary" onClick={copy}>
      <Copy size={16} />
      {label}
    </Button>
  );
}
