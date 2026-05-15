import { NextResponse } from "next/server";
import type { AnalyzeRequest, AnalyzeType, ImageFields, VideoFields } from "@/lib/types";

const imageKeys: Array<keyof ImageFields> = [
  "subject", "scene", "interaction", "emotion", "ratio", "camera", "layout", "style", "lighting", "color", "texture", "reference", "scale", "mustNot", "negative"
];

const videoKeys: Array<keyof VideoFields> = [
  "subject", "scene", "startFrame", "endFrame", "action", "ratio", "duration", "pace", "cameraMovement", "shotSize", "transition", "style", "lighting", "color", "sound", "textRequirement", "mustNot", "negative"
];

export async function POST(request: Request) {
  let body: AnalyzeRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "请求格式不是有效 JSON。" }, { status: 400 });
  }

  if (body.type !== "image" && body.type !== "video") {
    return NextResponse.json({ ok: false, error: "type 只能是 image 或 video。" }, { status: 400 });
  }

  const rawIdea = typeof body.rawIdea === "string" ? body.rawIdea.trim() : "";
  if (!rawIdea) {
    return NextResponse.json({ ok: false, error: "请先输入需求，再使用 AI 快速拆解。" }, { status: 400 });
  }
  if (rawIdea.length > 4000) {
    return NextResponse.json({ ok: false, error: "输入超过 4000 字，请缩短后再试。" }, { status: 400 });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: "未配置 DEEPSEEK_API_KEY。你仍然可以使用离线拆解。" }, { status: 503 });
  }

  try {
    const data = await callDeepSeek(apiKey, body.type, rawIdea, body.currentFields ?? {});
    return NextResponse.json({ ok: true, type: body.type, data });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "AI 拆解失败，请使用离线拆解。" }, { status: 502 });
  }
}

async function callDeepSeek(apiKey: string, type: AnalyzeType, rawIdea: string, currentFields: object) {
  const allowed = type === "image" ? imageKeys : videoKeys;
  const system = [
    "你是 Prompt Studio 的关键词字段拆解器。",
    "只返回严格 JSON 对象，不要解释文字，不要 markdown。",
    `只允许返回这些字段：${allowed.join(", ")}。`,
    "不要默认绑定任何具体产品或品牌关键词。",
    "字段值必须是中文短句，适合用户继续手动编辑。"
  ].join("\n");

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "deepseek-v4-flash",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: JSON.stringify({ type, rawIdea, currentFields }, null, 2) }
      ]
    })
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "AI 服务请求失败，请使用离线拆解。");
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content !== "string") throw new Error("AI 返回内容为空，请使用离线拆解。");

  const parsed = JSON.parse(stripMarkdownFence(content));
  return sanitizeFields(parsed, allowed);
}

function stripMarkdownFence(content: string) {
  return content.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
}

function sanitizeFields<T extends string>(input: unknown, allowed: readonly T[]) {
  const out: Partial<Record<T, string>> = {};
  if (!input || typeof input !== "object") return out;
  for (const key of allowed) {
    const value = (input as Record<string, unknown>)[key];
    if (typeof value === "string" && value.trim()) out[key] = value.trim();
  }
  return out;
}
