import { AppHeader } from "./AppHeader";

export function PageShell({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <section className="mb-6 rounded-[28px] border border-white bg-white/90 p-7 shadow-card">
          <p className="mb-2 text-sm font-semibold text-[#bf5b00]">Image & Video Prompt Keyword Builder</p>
          <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-[#1d1d1f] sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#6e6e73]">{description}</p>
        </section>
        {children}
      </main>
    </>
  );
}
