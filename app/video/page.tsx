import { PageShell } from "@/components/PageShell";
import { VideoPromptForm } from "@/components/VideoPromptForm";

export default function VideoPage() {
  return (
    <PageShell title="视频生成关键词完善" description="把一句视频需求拆成主体、场景、起止画面、过程动作、镜头运动、景别、转场、声音、文字要求和负面关键词。">
      <VideoPromptForm />
    </PageShell>
  );
}
