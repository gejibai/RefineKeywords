import type { ImageFields } from "./types";

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

export function parseImageIdea(current: ImageFields, overwrite: boolean): ImageFields {
  const text = current.rawIdea.trim();
  const inferred: Partial<ImageFields> = {
    ratio: inferRatio(text) || "9:16 竖版",
    negative: inferNegative(text)
  };

  const subject = inferSubject(text);
  if (subject) inferred.subject = subject;
  if (has(text, ["客厅", "卧室", "书桌", "家庭"])) {
    inferred.scene = has(text, ["书桌"]) ? "生活化家庭书桌场景" : "生活化真实家庭空间";
    inferred.style = "生活化真实摄影，画面自然干净";
    inferred.lighting = "柔和自然窗光，温暖室内光";
    inferred.emotion = "温馨、安心、陪伴感";
    inferred.color = "暖白、浅木色、低饱和家庭色调";
  }
  if (has(text, ["实验室", "检测", "安全", "认证"])) {
    inferred.scene = "专业实验室或检测场景";
    inferred.style = "真实摄影，专业科技感，干净可信";
    inferred.lighting = "柔和蓝白实验室光，洁净照明";
    inferred.emotion = "专业、可靠、安全感";
    inferred.color = "白色、浅灰、柔和蓝色科技色调";
  }
  if (has(text, ["图标", "icon", "剪影"])) {
    inferred.style = "极简剪影图标，单色图形，透明背景";
    inferred.layout = "主体居中，造型简单清晰，适合功能点展示";
    inferred.ratio = "透明背景单元素";
    inferred.mustNot = "不要复杂背景，不要真实照片风，不要文字";
  }
  if (has(text, ["海报", "详情页", "KV"])) {
    inferred.layout = "电商视觉构图，主体明确，保留标题和卖点空间，卡片式信息层级";
    inferred.style = inferred.style || "电商精修视觉，干净明亮，高级商业摄影";
  }
  if (has(text, ["睡前", "陪伴", "亲子", "老人", "孩子"])) {
    inferred.emotion = "温馨、安心、陪伴感";
  }

  inferred.interaction = inferInteraction(text);
  inferred.camera = inferCamera(text);
  inferred.layout = inferred.layout || inferLayout(text);
  inferred.texture = inferTexture(text);
  inferred.mustNot = inferred.mustNot || inferMustNot(text);

  return fill(current, inferred, overwrite);
}

export function polishImage(current: ImageFields, overwrite: boolean): ImageFields {
  return fill(
    current,
    {
      ratio: "9:16 竖版",
      layout: "主体明确，画面干净，视觉焦点集中，背景不过度杂乱",
      style: "真实摄影质感，干净明亮，高级商业视觉",
      lighting: "柔和均匀光线，主体边缘清晰，阴影自然",
      color: "低饱和、干净统一的色彩搭配",
      texture: "真实材质细节，边缘清晰，画面不过度锐化",
      mustNot: "不要文字，不要 logo，不要杂乱背景，不要比例错误",
      negative: "畸形手指、比例错误、低清晰度、过曝、杂乱背景、文字乱码、主体变形"
    },
    overwrite
  );
}

function inferSubject(text: string) {
  const found = [];
  if (has(text, ["孩子", "儿童", "男孩", "女孩"])) found.push("孩子");
  if (has(text, ["老人", "老年"])) found.push("老人");
  if (has(text, ["人物", "人像", "女性", "男性"])) found.push("人物主体");
  if (has(text, ["产品", "商品"])) found.push("产品主体");
  if (has(text, ["手机"])) found.push("手机");
  if (has(text, ["耳机"])) found.push("耳机");
  if (has(text, ["图标", "icon"])) found.push("功能图标");
  return unique(found);
}

function inferInteraction(text: string) {
  const found = [];
  if (has(text, ["写作业", "学习", "辅导"])) found.push("主体之间形成学习辅导或陪伴关系");
  if (has(text, ["拥抱", "陪伴", "亲子"])) found.push("人物自然互动，动作轻柔亲近");
  if (has(text, ["对话", "聊天", "说话"])) found.push("主体之间自然对话，体现沟通关系");
  if (has(text, ["展示", "特写", "细节"])) found.push("主体被重点展示，局部细节清晰可见");
  return unique(found);
}

function inferRatio(text: string) {
  if (has(text, ["1:1", "方图", "方形", "主图"])) return "1:1 方图";
  if (has(text, ["16:9", "横版", "横图"])) return "16:9 横图";
  if (has(text, ["4:3"])) return "4:3 横图";
  if (has(text, ["透明背景", "icon", "图标", "剪影"])) return "透明背景单元素";
  if (has(text, ["9:16", "竖版", "详情页", "短视频封面"])) return "9:16 竖版";
  return "";
}

function inferCamera(text: string) {
  if (has(text, ["俯拍", "鸟瞰"])) return "轻微俯拍视角，画面结构清晰";
  if (has(text, ["低机位"])) return "低机位视角，突出主体存在感";
  if (has(text, ["正面"])) return "正面视角，主体识别清晰";
  if (has(text, ["特写", "细节", "微距"])) return "近景或局部特写，突出细节质感";
  return "";
}

function inferLayout(text: string) {
  if (has(text, ["留白", "文案", "标题", "卖点"])) return "保留文案空间，主体与信息区分离";
  if (has(text, ["居中", "正中"])) return "主体居中，视觉焦点集中";
  if (has(text, ["虚化", "浅景深"])) return "前景主体清晰，背景柔和虚化，浅景深";
  return "";
}

function inferTexture(text: string) {
  if (has(text, ["产品", "细节", "材质"])) return "真实产品材质，边缘清晰，细节锐利但不过度锐化";
  if (has(text, ["人物", "孩子", "老人"])) return "皮肤自然，肢体比例真实";
  if (has(text, ["书桌", "木质", "桌面"])) return "桌面纹理自然细腻，生活物件真实";
  return "";
}

function inferMustNot(text: string) {
  const found = ["不要文字", "不要 logo"];
  if (has(text, ["人物", "孩子", "老人"])) found.push("不要肢体畸形", "不要手指错误");
  if (has(text, ["客厅", "卧室", "书桌", "保持"])) found.push("不要新增无关家具", "不要改变空间布局");
  return unique(found);
}

function inferNegative(text: string) {
  const found = ["畸形手指", "比例错误", "低清晰度", "过曝", "杂乱背景", "文字乱码", "主体变形"];
  if (has(text, ["人物", "孩子", "老人"])) found.push("肢体畸形", "表情僵硬");
  if (has(text, ["产品", "商品"])) found.push("产品结构错误", "边缘模糊");
  return unique(found);
}
