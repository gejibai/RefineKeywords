export function TemplateCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-white bg-white/90 p-5 shadow-card">
      <h3 className="font-extrabold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#6e6e73]">{description}</p>
    </div>
  );
}
