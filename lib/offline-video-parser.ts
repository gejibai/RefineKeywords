import type { VideoFields } from "./types";

const has = (text: string, words: string[]) => words.some((word) => text.includes(word));
const unique = (items: string[]) => Array.from(new Set(items.filter(Boolean))).join("，");

function fill<T extends Record<string, string>>(current: T, next: Partial<T>, overwrite: boolean): T {
  const merged = { ...current };
  for (const [key, value] of Object.entries(next) as [keyof T, string][]) {
    if (!value) continue;
    if (overwrite || !merged[key]?.trim()) merged[key] = value as T[keyof T];
  }
  return merged;
}

export function parseVideoIdea(current: VideoFields, overwrite: boolean): VideoFields {
  const text = current.rawIdea.trim();
  return fill(
    current,
    {
      subject: inferSubject(text),
      scene: inferScene(text),
      startFrame: inferStart(text),
      endFrame: inferEnd(text),
      action: inferAction(text),
      ratio: inferRatio(text) || "9:16 竖版短视频",
      duration: inferDuration(text) || "5秒",
      pace: inferPace(text),
      cameraMovement: inferCamera(text),
      shotSize: inferShot(text),
      transition: "动作连续，无突兀跳切，镜头平滑过渡，主体始终稳定",
      style: inferStyle(text),
      lighting: inferLighting(text),
      color: inferColor(text),
      sound: has(text, ["无声", "静音"]) ? "无声音" : "无对白，可搭配轻微背景音乐或环境音",
      textRequirement: has(text, ["文字", "标题", "字幕"]) ? "预留安全留白用于后期添加文字，避免自动生成乱码文字" : "不要出现文字和 logo",
      mustNot: inferMustNot(text),
      negative: inferNegative(text)
    },
    overwrite
  );
}

export function polishVideo(current: VideoFields, overwrite: boolean): VideoFields {
  return fill(
    current,
    {
      ratio: "9:16 竖版短视频",
      duration: "5秒",
      pace: "中等节奏，自然流畅",
      cameraMovement: "镜头缓慢推进或轻微环绕，运动克制稳定",
      shotSize: "中景到近景，主体清晰突出",
      transition: "动作连续，无突兀跳切，镜头平滑过渡，主体始终稳定",
      style: "真实摄影，画面干净高级",
      lighting: "柔和自然光，明暗层次自然",
      color: "色彩统一，低饱和高级感",
      sound: "无对白，可搭配轻微背景音乐或环境音",
      textRequirement: "不要出现文字和 logo",
      mustNot: "不要镜头突然跳切，不要主体变形，不要低清晰度，不要文字乱码",
      negative: "画面闪烁、主体漂移、人物变形、肢体畸形、镜头抖动、低清晰度、动作不连贯"
    },
    overwrite
  );
}

function inferSubject(text: string) {
  if (has(text, ["产品", "商品"])) return "产品主体";
  if (has(text, ["人物", "人像", "孩子", "老人"])) return "人物主体";
  if (has(text, ["城市", "街景", "风景"])) return "环境场景";
  return "";
}

function inferScene(text: string) {
  if (has(text, ["客厅", "卧室", "家庭", "书桌"])) return "生活化真实家庭场景";
  if (has(text, ["实验室", "检测", "安全", "认证"])) return "专业实验室或科技感检测场景";
  if (has(text, ["影棚", "棚拍", "桌面"])) return "干净影棚或极简桌面场景";
  if (has(text, ["城市", "街景", "夜景"])) return "真实城市街景";
  return "";
}

function inferStart(text: string) {
  if (has(text, ["产品", "商品"])) return "产品静止在画面中央，背景干净，轮廓清晰";
  if (has(text, ["人物", "孩子", "老人"])) return "人物自然出现在画面中，姿态稳定，表情自然";
  return "主体在画面中保持稳定，镜头准备开始运动";
}

function inferEnd(text: string) {
  if (has(text, ["产品", "细节", "特写"])) return "镜头停留在主体细节特写，突出质感";
  return "动作自然结束，画面停留在稳定清晰的主体构图上";
}

function inferAction(text: string) {
  const found = [];
  if (has(text, ["旋转"])) found.push("主体缓慢旋转，光线扫过表面，细节逐渐显现");
  if (has(text, ["推进", "靠近"])) found.push("镜头逐渐靠近主体，视觉焦点稳定");
  if (has(text, ["走", "跑"])) found.push("主体自然移动，运动轨迹连续");
  if (has(text, ["转头", "看向"])) found.push("人物缓慢转头看向镜头，动作自然可信");
  if (has(text, ["展示", "产品"])) found.push("主体被平稳展示，细节逐步呈现");
  return unique(found) || "主体做自然、缓慢、可信的动作，运动连续稳定";
}

function inferRatio(text: string) {
  if (has(text, ["16:9", "横版"])) return "16:9 横版视频";
  if (has(text, ["1:1", "方形"])) return "1:1 方形视频";
  if (has(text, ["4:5", "信息流"])) return "4:5 竖版信息流视频";
  if (has(text, ["9:16", "竖版", "短视频"])) return "9:16 竖版短视频";
  return "";
}

function inferDuration(text: string) {
  if (has(text, ["15秒", "十五秒"])) return "15秒";
  if (has(text, ["10秒", "十秒"])) return "10秒";
  if (has(text, ["8秒", "八秒"])) return "8秒";
  return "";
}

function inferPace(text: string) {
  if (has(text, ["快节奏", "冲击", "抓眼", "快速"])) return "快节奏，干脆有冲击力";
  if (has(text, ["慢", "缓慢", "高级", "平稳"])) return "慢节奏，平稳流畅";
  return "中等节奏，自然流畅";
}

function inferCamera(text: string) {
  if (has(text, ["推进", "靠近"])) return "镜头缓慢推进，运动平稳";
  if (has(text, ["环绕", "旋转"])) return "镜头围绕主体轻微环绕，保持主体居中";
  if (has(text, ["固定", "静止"])) return "固定镜头，主体动作自然变化";
  if (has(text, ["跟拍"])) return "稳定跟拍，运动连续";
  return "镜头缓慢推进或轻微环绕，运动克制稳定";
}

function inferShot(text: string) {
  if (has(text, ["特写", "细节", "微距"])) return "近景到细节特写";
  if (has(text, ["全景", "环境"])) return "全景到中景，交代空间环境";
  return "中景到近景，主体清晰突出";
}

function inferStyle(text: string) {
  if (has(text, ["实验室", "检测", "科技"])) return "真实摄影，专业科技感，干净可信";
  if (has(text, ["电影", "质感"])) return "真实摄影，电影感，画面干净高级";
  if (has(text, ["商业", "产品"])) return "真实摄影，商业广告质感，干净高级";
  return "真实摄影，画面干净高级";
}

function inferLighting(text: string) {
  if (has(text, ["实验室", "检测", "蓝白"])) return "柔和蓝白实验室光，洁净照明";
  if (has(text, ["家庭", "客厅", "卧室", "书桌"])) return "柔和自然窗光，温暖室内光";
  return "柔和自然光，明暗层次自然";
}

function inferColor(text: string) {
  if (has(text, ["家庭", "温馨", "陪伴"])) return "暖白、浅木色、低饱和家庭色调";
  if (has(text, ["科技", "实验室"])) return "白色、浅灰、柔和蓝色科技色调";
  return "色彩统一，低饱和高级感";
}

function inferMustNot(text: string) {
  const found = ["不要镜头突然跳切", "不要主体变形", "不要低清晰度"];
  if (has(text, ["人物", "孩子", "老人"])) found.push("不要人物变脸", "不要肢体畸形");
  if (has(text, ["产品", "商品"])) found.push("不要产品结构变形", "不要材质漂移");
  if (!has(text, ["文字", "标题", "字幕"])) found.push("不要文字和 logo");
  return unique(found);
}

function inferNegative(text: string) {
  const found = ["画面闪烁", "主体漂移", "人物变形", "肢体畸形", "镜头抖动", "低清晰度", "动作不连贯"];
  if (has(text, ["产品", "商品"])) found.push("产品变形", "结构错误", "边缘模糊");
  return unique(found);
}
