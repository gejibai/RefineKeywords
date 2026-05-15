import type { ImageAnalysisResult } from "./types";

function hex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("")}`;
}

function colorName([r, g, b]: number[]) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const sat = max - min;
  const lum = (r + g + b) / 3;
  if (lum > 225 && sat < 26) return "近白色";
  if (lum < 38 && sat < 28) return "近黑色";
  if (sat < 22) return lum > 160 ? "浅灰色" : lum > 90 ? "中性灰" : "深灰色";
  if (r > g + 25 && r > b + 25) return r > 190 && g > 120 ? "暖橙/肤色" : "红棕色";
  if (g > r + 20 && g > b + 20) return "绿色系";
  if (b > r + 20 && b > g + 20) return b > 170 ? "蓝色系" : "深蓝系";
  if (r > 180 && g > 160 && b < 120) return "米黄/暖色";
  if (r > 150 && b > 150 && g < 130) return "紫粉色系";
  return "混合色";
}

export function analyzeImageElement(img: HTMLImageElement, canvas: HTMLCanvasElement): ImageAnalysisResult {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("无法读取 Canvas。");

  const scale = Math.min(1, 360 / Math.max(img.naturalWidth, img.naturalHeight));
  canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let lumSum = 0;
  let satSum = 0;
  let warm = 0;
  let cool = 0;
  const lums: number[] = [];
  const buckets = new Map<string, number>();

  for (let i = 0; i < data.length; i += 16) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (a < 120) continue;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const sat = max === 0 ? 0 : (max - min) / max;
    lumSum += lum;
    satSum += sat;
    lums.push(lum);
    warm += r + b * 0.18;
    cool += b + g * 0.12;
    const key = `${Math.round(r / 32) * 32},${Math.round(g / 32) * 32},${Math.round(b / 32) * 32}`;
    buckets.set(key, (buckets.get(key) || 0) + 1);
  }

  const n = Math.max(1, lums.length);
  const avgLum = lumSum / n;
  const avgSat = satSum / n;
  const contrast = Math.sqrt(lums.reduce((sum, lum) => sum + (lum - avgLum) ** 2, 0) / n);
  const palette = Array.from(buckets.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([key]) => key.split(",").map(Number));
  const ratio = img.naturalWidth / img.naturalHeight;

  const ratioText =
    Math.abs(ratio - 9 / 16) < 0.09 ? "接近 9:16 竖版" :
    Math.abs(ratio - 1) < 0.08 ? "接近 1:1 方图" :
    Math.abs(ratio - 4 / 3) < 0.1 ? "接近 4:3 横图" :
    Math.abs(ratio - 16 / 9) < 0.12 ? "接近 16:9 横图" :
    ratio < 1 ? "偏竖版构图" : "偏横版构图";

  const brightnessText = avgLum > 190 ? "高亮、整体明亮" : avgLum > 120 ? "中等亮度、曝光均衡" : avgLum > 70 ? "偏暗、低调光线" : "很暗、暗调氛围";
  const saturationText = avgSat > 0.42 ? "高饱和、色彩鲜明" : avgSat > 0.22 ? "中等饱和、自然色彩" : "低饱和、柔和克制";
  const contrastText = contrast > 68 ? "高对比、明暗反差强" : contrast > 38 ? "中等对比、层次自然" : "低对比、柔和扁平";
  const temperature = warm > cool * 1.06 ? "偏暖色调" : cool > warm * 1.06 ? "偏冷色调" : "中性色调";
  const suggestions = [
    ratioText.includes("竖版") ? "竖版构图，适合详情页或短视频封面" : ratioText.includes("方图") ? "方图构图，适合平台封面或主图" : "横向构图，适合场景展示或网页横幅",
    avgLum > 150 ? "明亮干净的视觉氛围" : "暗调或低调视觉氛围",
    avgSat < 0.22 ? "低饱和高级感" : "色彩较鲜明，视觉抓眼",
    contrast < 38 ? "柔和光线，阴影不重" : "层次对比明确"
  ];

  return {
    width: img.naturalWidth,
    height: img.naturalHeight,
    sizeText: `${img.naturalWidth} × ${img.naturalHeight}px`,
    ratioText,
    paletteHex: palette.map(([r, g, b]) => hex(r, g, b)),
    paletteNames: Array.from(new Set(palette.map(colorName))).slice(0, 5),
    temperature,
    brightnessText,
    saturationText,
    contrastText,
    suggestions
  };
}
