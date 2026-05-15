"use client";

import { Bot, Eraser, Wand2 } from "lucide-react";
import { Button } from "./Button";

export function ModelActionBar({ onFillEmpty, onOverwrite, onAi, onClear, aiBusy }: { onFillEmpty: () => void; onOverwrite: () => void; onAi: () => void; onClear: () => void; aiBusy?: boolean }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="primary" onClick={onFillEmpty}>
        <Wand2 size={16} />
        离线拆解，只补空项
      </Button>
      <Button onClick={onOverwrite}>离线拆解，覆盖填充</Button>
      <Button onClick={onAi} disabled={aiBusy}>
        <Bot size={16} />
        {aiBusy ? "AI 拆解中" : "AI 快速拆解"}
      </Button>
      <Button variant="danger" onClick={onClear}>
        <Eraser size={16} />
        清空
      </Button>
    </div>
  );
}
