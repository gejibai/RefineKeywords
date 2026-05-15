import type { AnalyzeRequest, AnalyzeResponse } from "./types";

export async function analyzeWithAi(request: AnalyzeRequest): Promise<AnalyzeResponse> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  });

  const data = (await response.json().catch(() => ({
    ok: false,
    error: "AI 返回格式异常，请使用离线拆解。"
  }))) as AnalyzeResponse;

  if (!response.ok && data.ok !== false) {
    return { ok: false, error: "AI 请求失败，请使用离线拆解。" };
  }

  return data;
}
