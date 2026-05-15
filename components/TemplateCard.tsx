export function TemplateCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-[#8d5a34]/20 bg-[#fffdf3]/90 p-5 shadow-card">
      <h3 className="font-extrabold text-[#31504a]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#687c72]">{description}</p>
    </div>
  );
}
