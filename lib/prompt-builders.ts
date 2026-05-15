import type { ImageAnalysisResult, ImageFields, ReverseFields, VideoFields } from "./types";

const line = (label: string, value: string) => (value.trim() ? `${label}：${value.trim()}` : "");

export function buildImagePrompt(fields: ImageFields) {
  return [
    line("任务", fields.rawIdea),
    line("主体", fields.subject),
    line("场景", fields.scene),
    line("动作与关系", fields.interaction),
    line("情绪氛围", fields.emotion),
    line("画面比例", fields.ratio),
    line("镜头视角", fields.camera),
    line("构图布局", fields.layout),
    line("画面风格", fields.style),
    line("光线", fields.lighting),
    line("色彩", fields.color),
    line("细节质感", fields.texture),
    line("参考图要求", fields.reference),
    line("尺寸比例要求", fields.scale),
    line("不要出现", fields.mustNot),
    line("负面关键词", fields.negative)
  ].filter(Boolean).join("\n");
}

export function buildImageKeywords(fields: ImageFields) {
  const groups = [
    ["视觉主体", [fields.subject, fields.reference, fields.scale]],
    ["场景关系", [fields.scene, fields.interaction, fields.emotion]],
    ["构图镜头", [fields.ratio, fields.camera, fields.layout]],
    ["风格光线", [fields.style, fields.lighting, fields.color, fields.texture]],
    ["禁区控制", [fields.mustNot, fields.negative]]
  ];

  return groups
    .map(([name, values]) => `【${name}】\n${(values as string[]).filter(Boolean).map((v) => `- ${v}`).join("\n") || "- 待补充"}`)
    .join("\n\n");
}

export function buildImageJson(fields: ImageFields, reverse?: ReverseFields) {
  return JSON.stringify(
    {
      type: "image",
      rawIdea: fields.rawIdea,
      fields,
      reverseAnalysis: reverse?.analysis ?? null,
      finalPrompt: buildImagePrompt(fields)
    },
    null,
    2
  );
}

export function buildReverseSummary(reverse: ReverseFields) {
  const a = reverse.analysis;
  if (!a) return "尚未上传图片。";
  return [
    "【图片视觉反推】",
    `图片尺寸：${a.sizeText}`,
    `接近比例：${a.ratioText}`,
    `主色：${a.paletteNames.join("、") || "未识别"}`,
    `冷暖色倾向：${a.temperature}`,
    `明暗程度：${a.brightnessText}`,
    `饱和度：${a.saturationText}`,
    `对比度：${a.contrastText}`,
    `基础构图建议：${a.suggestions.join("；")}`,
    reverse.subject ? `图中主体：${reverse.subject}` : "",
    reverse.scene ? `图中场景：${reverse.scene}` : "",
    reverse.interaction ? `动作/关系：${reverse.interaction}` : "",
    reverse.note ? `观察备注：${reverse.note}` : ""
  ].filter(Boolean).join("\n");
}

export function fieldsFromAnalysis(analysis: ImageAnalysisResult): Partial<ImageFields> {
  return {
    ratio: analysis.ratioText,
    layout: analysis.suggestions[0] ?? "",
    lighting: `${analysis.brightnessText}，${analysis.contrastText}`,
    color: `${analysis.temperature}，${analysis.saturationText}，主色包含${analysis.paletteNames.join("、")}`,
    style: analysis.saturationText.includes("低饱和") ? "低饱和、干净高级、真实摄影质感" : "色彩自然、真实摄影质感"
  };
}

export function buildVideoPrompt(fields: VideoFields) {
  return [
    line("任务", fields.rawIdea),
    line("主体", fields.subject),
    line("场景", fields.scene),
    line("开始画面", fields.startFrame),
    line("过程动作", fields.action),
    line("结束画面", fields.endFrame),
    line("视频比例", fields.ratio),
    line("时长", fields.duration),
    line("节奏", fields.pace),
    line("镜头运动", fields.cameraMovement),
    line("景别", fields.shotSize),
    line("转场", fields.transition),
    line("风格", fields.style),
    line("光线", fields.lighting),
    line("色彩", fields.color),
    line("声音", fields.sound),
    line("文字要求", fields.textRequirement),
    line("不要出现", fields.mustNot),
    line("负面关键词", fields.negative)
  ].filter(Boolean).join("\n");
}

export function buildVideoStoryboard(fields: VideoFields) {
  return [
    `【开始画面】\n${fields.startFrame || "待补充开始画面"}`,
    `【过程动作】\n${fields.action || "待补充过程动作"}\n镜头：${fields.cameraMovement || "待补充镜头运动"}\n节奏：${fields.pace || "待补充节奏"}`,
    `【结束画面】\n${fields.endFrame || "待补充结束画面"}`,
    `【统一视觉】\n${[fields.style, fields.lighting, fields.color, fields.shotSize].filter(Boolean).join("，") || "待补充风格、光线、色彩、景别"}`,
    `【禁区】\n${[fields.mustNot, fields.negative].filter(Boolean).join("，") || "待补充不要出现的内容"}`
  ].join("\n\n");
}

export function buildVideoJson(fields: VideoFields) {
  return JSON.stringify(
    {
      type: "video",
      fields,
      storyboard: buildVideoStoryboard(fields),
      finalPrompt: buildVideoPrompt(fields)
    },
    null,
    2
  );
}
