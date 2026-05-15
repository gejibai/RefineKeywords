import { PageShell } from "@/components/PageShell";
import { ReverseImagePanel } from "@/components/ReverseImagePanel";

export default function ReversePage() {
  return (
    <PageShell title="图片反推关键词" description="上传参考图后只在浏览器本地预览和 Canvas 分析，自动提取尺寸、比例、主色、冷暖、明暗、饱和度和对比度。">
      <ReverseImagePanel />
    </PageShell>
  );
}
