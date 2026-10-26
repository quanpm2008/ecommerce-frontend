export default function PagePlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mt-4 max-w-2xl leading-7 text-slate-600">{description}</p>
    </section>
  )
}
