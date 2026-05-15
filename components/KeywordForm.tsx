"use client";

import { useEffect, useMemo, useState } from "react";
import { analyzeWithAi } from "@/lib/ai-client";
import { parseImageIdea, polishImage } from "@/lib/offline-image-parser";
import { buildImageJson, buildImageKeywords, buildImagePrompt } from "@/lib/prompt-builders";
import { clearStored, loadStored, saveStored, storageKeys } from "@/lib/storage";
import { emptyImageFields, type ImageFields } from "@/lib/types";
import { Button } from "./Button";
import { FieldGroup, inputClass } from "./FieldGroup";
import { ModelActionBar } from "./ModelActionBar";
import { PromptOutput } from "./PromptOutput";

const fields: Array<[keyof ImageFields, string, string, "input" | "textarea" | "select"]> = [
  ["subject", "subject：主体", "例：人物主体、产品主体、功能图标", "input"],
  ["scene", "scene：场景", "例：家庭客厅、实验室、极简影棚", "input"],
  ["interaction", "interaction：动作 / 关系", "例：自然互动、展示细节、陪伴关系", "input"],
  ["emotion", "emotion：情绪氛围", "例：温馨、安心、专业、科技感", "input"],
  ["ratio", "ratio：画面比例", "", "select"],
  ["camera", "camera：镜头 / 视角", "例：正面、俯拍、低机位、特写", "input"],
  ["layout", "layout：构图布局", "例：主体居中、右侧留白、浅景深", "input"],
  ["style", "style：画面风格", "例：真实摄影、电商精修、极简剪影", "input"],
  ["lighting", "lighting：光线", "例：柔和窗光、蓝白实验室光", "input"],
  ["color", "color：色彩", "例：暖白、低饱和、蓝白科技色", "input"],
  ["texture", "texture：细节质感", "例：真实材质、边缘清晰", "input"],
  ["reference", "reference：参考图要求", "例：参考图只作为构图/色彩参考", "textarea"],
  ["scale", "scale：尺寸 / 比例要求", "例：产品比例真实，不夸张放大", "textarea"],
  ["mustNot", "mustNot：明确不要", "例：不要文字，不要 logo，不要杂乱背景", "textarea"],
  ["negative", "negative：负面关键词", "例：畸形手指、比例错误、低清晰度", "textarea"]
];

export function KeywordForm() {
  const [data, setData] = useState<ImageFields>(emptyImageFields);
  const [tab, setTab] = useState("prompt");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => setData(loadStored(storageKeys.image, emptyImageFields)), []);
  useEffect(() => saveStored(storageKeys.image, data), [data]);

  const outputs = useMemo(() => ({
    prompt: buildImagePrompt(data),
    keywords: buildImageKeywords(data),
    json: buildImageJson(data)
  }), [data]);

  function update(key: keyof ImageFields, value: string) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function runAi() {
    const rawIdea = data.rawIdea.trim();
    setMessage("");
    if (!rawIdea) return setMessage("请先输入原始想法，再请求 AI 拆解。");
    if (rawIdea.length > 4000) return setMessage("原始想法超过 4000 字，请缩短后再试。");
    setBusy(true);
    const result = await analyzeWithAi({ type: "image", rawIdea, currentFields: data });
    setBusy(false);
    if (!result.ok) return setMessage(result.error);
    setData((prev) => ({ ...prev, ...(result.data as Partial<ImageFields>) }));
    setMessage("AI 已填入字段，你可以继续手动修改。");
  }

  function clear() {
    setData(emptyImageFields);
    clearStored(storageKeys.image);
    setMessage("已清空图片关键词页。");
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_430px]">
      <div className="space-y-5">
        <div className="rounded-[28px] border border-white bg-white/95 p-6 shadow-card">
          <FieldGroup label="原始想法" hint="输入一句粗略需求，然后选择离线或 AI 拆解。">
            <textarea className={inputClass} rows={4} value={data.rawIdea} onChange={(event) => update("rawIdea", event.target.value)} placeholder="例：生成一张孩子在书桌前学习的温馨真实摄影场景图" />
          </FieldGroup>
          <div className="mt-4">
            <ModelActionBar
              onFillEmpty={() => setData((prev) => polishImage(parseImageIdea(prev, false), false))}
              onOverwrite={() => setData((prev) => polishImage(parseImageIdea(prev, true), true))}
              onAi={runAi}
              onClear={clear}
              aiBusy={busy}
            />
          </div>
          {message ? <p className="mt-4 rounded-2xl bg-[#eef6ff] px-4 py-3 text-sm text-[#0b4f8a]">{message}</p> : null}
        </div>

        <div className="rounded-[28px] border border-white bg-white/95 p-6 shadow-card">
          <div className="grid gap-4 md:grid-cols-2">
            {fields.map(([key, label, placeholder, type]) => (
              <FieldGroup key={key} label={label} className={type === "textarea" ? "md:col-span-2" : ""}>
                {type === "select" ? (
                  <select className={inputClass} value={data[key]} onChange={(event) => update(key, event.target.value)}>
                    <option>9:16 竖版</option>
                    <option>1:1 方图</option>
                    <option>4:3 横图</option>
                    <option>16:9 横图</option>
                    <option>透明背景单元素</option>
                  </select>
                ) : type === "textarea" ? (
                  <textarea className={inputClass} rows={3} value={data[key]} onChange={(event) => update(key, event.target.value)} placeholder={placeholder} />
                ) : (
                  <input className={inputClass} value={data[key]} onChange={(event) => update(key, event.target.value)} placeholder={placeholder} />
                )}
              </FieldGroup>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={() => setData((prev) => polishImage(prev, false))}>补齐通用关键词</Button>
            <Button variant="dark" onClick={() => navigator.clipboard.writeText(outputs.prompt)}>复制完整图片提示词</Button>
          </div>
        </div>
      </div>

      <PromptOutput
        title="图片生成结果"
        baseName="image-prompt"
        active={tab}
        onActiveChange={setTab}
        tabs={[
          { id: "prompt", label: "完整提示词", content: outputs.prompt },
          { id: "keywords", label: "关键词分层", content: outputs.keywords },
          { id: "json", label: "JSON", content: outputs.json, mono: true }
        ]}
      />
    </section>
  );
}
