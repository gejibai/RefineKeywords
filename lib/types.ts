export type AnalyzeType = "image" | "video";

export type ImageFields = {
  rawIdea: string;
  subject: string;
  scene: string;
  interaction: string;
  emotion: string;
  ratio: string;
  camera: string;
  layout: string;
  style: string;
  lighting: string;
  color: string;
  texture: string;
  reference: string;
  scale: string;
  mustNot: string;
  negative: string;
};

export type VideoFields = {
  rawIdea: string;
  subject: string;
  scene: string;
  startFrame: string;
  endFrame: string;
  action: string;
  ratio: string;
  duration: string;
  pace: string;
  cameraMovement: string;
  shotSize: string;
  transition: string;
  style: string;
  lighting: string;
  color: string;
  sound: string;
  textRequirement: string;
  mustNot: string;
  negative: string;
};

export type ReverseFields = {
  subject: string;
  scene: string;
  interaction: string;
  note: string;
  analysis: ImageAnalysisResult | null;
};

export type ImageAnalysisResult = {
  width: number;
  height: number;
  sizeText: string;
  ratioText: string;
  paletteHex: string[];
  paletteNames: string[];
  temperature: string;
  brightnessText: string;
  saturationText: string;
  contrastText: string;
  suggestions: string[];
};

export type AnalyzeRequest = {
  type: AnalyzeType;
  rawIdea: string;
  currentFields: Partial<ImageFields | VideoFields>;
};

export type AnalyzeResponse =
  | { ok: true; type: AnalyzeType; data: Partial<ImageFields | VideoFields> }
  | { ok: false; error: string };

export const emptyImageFields: ImageFields = {
  rawIdea: "",
  subject: "",
  scene: "",
  interaction: "",
  emotion: "",
  ratio: "9:16 竖版",
  camera: "",
  layout: "",
  style: "",
  lighting: "",
  color: "",
  texture: "",
  reference: "",
  scale: "",
  mustNot: "",
  negative: ""
};

export const emptyVideoFields: VideoFields = {
  rawIdea: "",
  subject: "",
  scene: "",
  startFrame: "",
  endFrame: "",
  action: "",
  ratio: "9:16 竖版短视频",
  duration: "5秒",
  pace: "",
  cameraMovement: "",
  shotSize: "",
  transition: "",
  style: "",
  lighting: "",
  color: "",
  sound: "",
  textRequirement: "",
  mustNot: "",
  negative: ""
};

export const emptyReverseFields: ReverseFields = {
  subject: "",
  scene: "",
  interaction: "",
  note: "",
  analysis: null
};
