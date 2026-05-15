"use client";

import { useEffect, useMemo, useState } from "react";
import { analyzeWithAi } from "@/lib/ai-client";
import { parseVideoIdea, polishVideo } from "@/lib/offline-video-parser";
import { buildVideoJson, buildVideoPrompt, buildVideoStoryboard } from "@/lib/prompt-builders";
import { clearStored, loadStored, saveStored, storageKeys } from "@/lib/storage";
import { emptyVideoFields, type VideoFields } from "@/lib/types";
import { FieldGroup, inputClass } from "./FieldGroup";
import { ModelActionBar } from "./ModelActionBar";
import { PromptOutput } from "./PromptOutput";

const fields: Array<[keyof VideoFields, string, string, "input" | "textarea" | "select"]> = [
  ["subject", "subject：视频主体", "例：人物主体、产品主体、城市街景", "input"],
  ["scene", "scene：场景", "例：室内桌面、街景、实验室", "input"],
  ["startFrame", "startFrame：开始画面", "例：主体静止在画面中央", "input"],
  ["endFrame", "endFrame：结束画面", "例：停留在细节特写", "input"],
  ["action", "action：过程动作", "例：缓慢旋转、自然移动、光线扫过", "textarea"],
  ["ratio", "ratio：视频比例", "", "select"],
  ["duration", "duration：时长", "", "select"],
  ["pace", "pace：节奏", "例：慢节奏、平稳流畅", "input"],
  ["cameraMovement", "cameraMovement：镜头运动", "例：缓慢推进、轻微环绕", "input"],
  ["shotSize", "shotSize：景别", "例：中景到近景、细节特写", "input"],
  ["transition", "transition：转场", "例：动作连续，无突兀跳切", "input"],
  ["style", "style：视频风格", "例：真实摄影、电影感、商业广告", "input"],
  ["lighting", "lighting：光线", "例：柔和自然光、棚拍柔光", "input"],
  ["color", "color：色彩", "例：低饱和、暖白、蓝白科技色", "input"],
  ["sound", "sound：声音 / 氛围音", "例：无对白，轻微环境音", "input"],
  ["textRequirement", "textRequirement：字幕 / 文字要求", "例：不要文字和 logo", "textarea"],
  ["mustNot", "mustNot：明确不要", "例：不要镜头突然跳切", "textarea"],
  ["negative", "negative：负面关键词", "例：画面闪烁、主体漂移", "textarea"]
];

export function VideoPromptForm() {
  const [data, setData] = useState<VideoFields>(emptyVideoFields);
  const [tab, setTab] = useState("prompt");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => setData(loadStored(storageKeys.video, emptyVideoFields)), []);
  useEffect(() => saveStored(storageKeys.video, data), [data]);

  const outputs = useMemo(() => ({
    prompt: buildVideoPrompt(data),
    storyboard: buildVideoStoryboard(data),
    json: buildVideoJson(data)
  }), [data]);

  function update(key: keyof VideoFields, value: string) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function runAi() {
    const rawIdea = data.rawIdea.trim();
    setMessage("");
    if (!rawIdea) return setMessage("请先输入一句话视频需求，再请求 AI 拆解。");
    if (rawIdea.length > 4000) return setMessage("一句话视频需求超过 4000 字，请缩短后再试。");
    setBusy(true);
    const result = await analyzeWithAi({ type: "video", rawIdea, currentFields: data });
    setBusy(false);
    if (!result.ok) return setMessage(result.error);
    setData((prev) => ({ ...prev, ...(result.data as Partial<VideoFields>) }));
    setMessage("AI 已填入字段，你可以继续手动修改。");
  }

  function clear() {
    setData(emptyVideoFields);
    clearStored(storageKeys.video);
    setMessage("已清空视频关键词页。");
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_430px]">
      <div className="space-y-5">
        <div className="rounded-[28px] border border-white bg-white/95 p-6 shadow-card">
          <FieldGroup label="一句话视频需求" hint="只做关键词完善，不调用任何视频生成模型。">
            <textarea className={inputClass} rows={4} value={data.rawIdea} onChange={(event) => update("rawIdea", event.target.value)} placeholder="例：生成一个产品在桌面上缓慢旋转展示的高级商业短视频" />
          </FieldGroup>
          <div className="mt-4">
            <ModelActionBar
              onFillEmpty={() => setData((prev) => polishVideo(parseVideoIdea(prev, false), false))}
              onOverwrite={() => setData((prev) => polishVideo(parseVideoIdea(prev, true), true))}
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
                {type === "select" && key === "ratio" ? (
                  <select className={inputClass} value={data[key]} onChange={(event) => update(key, event.target.value)}>
                    <option>9:16 竖版短视频</option>
                    <option>16:9 横版视频</option>
                    <option>1:1 方形视频</option>
                    <option>4:5 竖版信息流视频</option>
                  </select>
                ) : type === "select" ? (
                  <select className={inputClass} value={data[key]} onChange={(event) => update(key, event.target.value)}>
                    <option>5秒</option>
                    <option>8秒</option>
                    <option>10秒</option>
                    <option>15秒</option>
                  </select>
                ) : type === "textarea" ? (
                  <textarea className={inputClass} rows={3} value={data[key]} onChange={(event) => update(key, event.target.value)} placeholder={placeholder} />
                ) : (
                  <input className={inputClass} value={data[key]} onChange={(event) => update(key, event.target.value)} placeholder={placeholder} />
                )}
              </FieldGroup>
            ))}
          </div>
        </div>
      </div>

      <PromptOutput
        title="视频生成结果"
        baseName="video-prompt"
        active={tab}
        onActiveChange={setTab}
        tabs={[
          { id: "prompt", label: "完整提示词", content: outputs.prompt },
          { id: "storyboard", label: "分镜拆解", content: outputs.storyboard },
          { id: "json", label: "JSON", content: outputs.json, mono: true }
        ]}
      />
    </section>
  );
}
