import { KeywordForm } from "@/components/KeywordForm";
import { PageShell } from "@/components/PageShell";

export default function ImagePage() {
  return (
    <PageShell title="图片生图关键词完善" description="从一句粗略想法开始，拆成主体、场景、关系、构图、风格、光线、负面关键词和可复制的完整图片提示词。">
      <KeywordForm />
    </PageShell>
  );
}
