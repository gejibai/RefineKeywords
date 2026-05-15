"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Upload } from "lucide-react";
import { analyzeImageElement } from "@/lib/image-analysis";
import { buildReverseSummary, fieldsFromAnalysis } from "@/lib/prompt-builders";
import { clearStored, loadStored, saveStored, storageKeys } from "@/lib/storage";
import { emptyImageFields, emptyReverseFields, type ImageFields, type ReverseFields } from "@/lib/types";
import { Button } from "./Button";
import { FieldGroup, inputClass } from "./FieldGroup";

export function ReverseImagePanel() {
  const [data, setData] = useState<ReverseFields>(emptyReverseFields);
  const [preview, setPreview] = useState("");
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => setData(loadStored(storageKeys.reverse, emptyReverseFields)), []);
  useEffect(() => saveStored(storageKeys.reverse, data), [data]);

  const summary = buildReverseSummary(data);

  function update(key: keyof ReverseFields, value: string) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function handleFile(file?: File) {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return url;
    });
  }

  function analyze() {
    if (!imgRef.current || !canvasRef.current) return;
    const analysis = analyzeImageElement(imgRef.current, canvasRef.current);
    setData((prev) => ({ ...prev, analysis }));
  }

  function applyToImagePage() {
    if (!data.analysis) return;
    const current = loadStored<ImageFields>(storageKeys.image, emptyImageFields);
    const patch = fieldsFromAnalysis(data.analysis);
    const next: ImageFields = {
      ...current,
      ...patch,
      subject: data.subject || current.subject,
      scene: data.scene || current.scene,
      interaction: data.interaction || current.interaction,
      rawIdea: data.note ? `${current.rawIdea ? `${current.rawIdea}\n` : ""}参考图观察：${data.note}` : current.rawIdea
    };
    saveStored(storageKeys.image, next);
  }

  function clear() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview("");
    setData(emptyReverseFields);
    clearStored(storageKeys.reverse);
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_430px]">
      <div className="space-y-5">
        <div className="rounded-[28px] border border-[#8d5a34]/20 bg-[#fffdf3]/95 p-6 shadow-card">
          <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
            <label className="relative grid min-h-[300px] cursor-pointer place-items-center overflow-hidden rounded-[28px] border border-dashed border-[#48a9b6]/45 bg-[#e9fbfb]/70 p-5 text-center transition hover:bg-[#e9fbfb]">
              <input className="absolute inset-0 opacity-0" type="file" accept="image/*" onChange={(event) => handleFile(event.target.files?.[0])} />
              {preview ? (
                <img ref={imgRef} src={preview} alt="本地预览" className="max-h-[280px] rounded-3xl object-contain shadow-card" onLoad={analyze} />
              ) : (
                <span className="flex flex-col items-center gap-3 text-sm text-[#687c72]">
                  <Upload />
                  <b className="text-[#31504a]">上传图片，本地分析</b>
                  图片只在浏览器内预览与 Canvas 分析，不上传服务器。
                </span>
              )}
            </label>
            <div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Info title="图片尺寸" value={data.analysis ? `${data.analysis.sizeText}\n${data.analysis.ratioText}` : "等待上传"} />
                <Info title="主色" value={data.analysis ? data.analysis.paletteNames.join("、") : "等待上传"} />
                <Info title="冷暖倾向" value={data.analysis?.temperature ?? "等待上传"} />
                <Info title="明暗 / 饱和度" value={data.analysis ? `${data.analysis.brightnessText}\n${data.analysis.saturationText}` : "等待上传"} />
                <Info title="对比度" value={data.analysis?.contrastText ?? "等待上传"} />
                <Info title="构图建议" value={data.analysis?.suggestions.join("；") ?? "等待上传"} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {data.analysis?.paletteHex.map((hex) => <span key={hex} title={hex} className="size-9 rounded-xl border border-black/10" style={{ background: hex }} />)}
              </div>
            </div>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="rounded-[28px] border border-[#8d5a34]/20 bg-[#fffdf3]/95 p-6 shadow-card">
          <div className="grid gap-4 md:grid-cols-2">
            <FieldGroup label="图中主体">
              <input className={inputClass} value={data.subject} onChange={(event) => update("subject", event.target.value)} placeholder="例：人物、产品、室内物件" />
            </FieldGroup>
            <FieldGroup label="图中场景">
              <input className={inputClass} value={data.scene} onChange={(event) => update("scene", event.target.value)} placeholder="例：客厅、书桌、实验室、街景" />
            </FieldGroup>
            <FieldGroup label="图中动作 / 关系" className="md:col-span-2">
              <input className={inputClass} value={data.interaction} onChange={(event) => update("interaction", event.target.value)} placeholder="例：人物互动、产品展示、静物陈列" />
            </FieldGroup>
            <FieldGroup label="观察备注" className="md:col-span-2">
              <textarea className={inputClass} rows={4} value={data.note} onChange={(event) => update("note", event.target.value)} placeholder="补充离线 Canvas 无法识别的语义信息。" />
            </FieldGroup>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/image" onClick={applyToImagePage}>
              <Button variant="primary">应用到图片关键词页</Button>
            </Link>
            <Button onClick={() => navigator.clipboard.writeText(summary)}>复制反推摘要</Button>
            <Button variant="danger" onClick={clear}>清空图片分析</Button>
          </div>
        </div>
      </div>

      <aside className="sticky top-24 rounded-[28px] border border-[#8d5a34]/20 bg-[#fffdf3]/95 p-6 shadow-island">
        <h2 className="mb-4 text-xl font-extrabold tracking-tight text-[#31504a]">反推摘要</h2>
        <pre className="min-h-[360px] whitespace-pre-wrap break-words rounded-3xl border border-[#8d5a34]/15 bg-white/80 p-4 text-sm leading-7 text-[#31504a] shadow-[inset_0_2px_10px_rgba(141,90,52,.06)]">{summary}</pre>
        <p className="mt-4 rounded-2xl border border-[#f27964]/20 bg-[#fff1c4] px-4 py-3 text-sm leading-6 text-[#7c5633]">
          原图不会写入 localStorage；页面只保存文字字段和 Canvas 分析结果。
        </p>
      </aside>
    </section>
  );
}

function Info({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl border border-[#8d5a34]/15 bg-white/70 p-4">
      <b className="text-sm text-[#31504a]">{title}</b>
      <p className="mt-2 whitespace-pre-line text-xs leading-5 text-[#687c72]">{value}</p>
    </div>
  );
}
