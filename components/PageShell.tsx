import { AppHeader } from "./AppHeader";

export function PageShell({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <section className="mb-6 overflow-hidden rounded-[28px] border border-[#8d5a34]/20 bg-[#fffdf3]/92 p-7 shadow-island">
          <p className="mb-2 text-sm font-black uppercase tracking-[0.16em] text-[#f27964]">Island Prompt Workshop</p>
          <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-[#31504a] sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#687c72]">{description}</p>
        </section>
        {children}
      </main>
    </>
  );
}
