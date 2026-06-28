export default function CuacaLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      <div className="h-16 bg-white shadow-sm" />
      <div className="bg-sky-50 px-4 pb-12 pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto h-6 w-64 rounded-full bg-zinc-200" />
          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="h-20 w-20 rounded-2xl bg-zinc-200" />
            <div className="h-20 w-40 rounded-2xl bg-zinc-200" />
            <div className="h-6 w-28 rounded bg-zinc-200" />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 pt-8">
        <div className="mb-4 h-4 w-24 rounded bg-zinc-200" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-zinc-100" />
          ))}
        </div>
        <div className="mb-4 mt-10 h-4 w-28 rounded bg-zinc-200" />
        <div className="overflow-hidden rounded-2xl border border-zinc-100">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex gap-4 border-b border-zinc-50 px-5 py-4 last:border-0">
              <div className="h-5 w-20 rounded bg-zinc-100" />
              <div className="h-5 flex-1 rounded bg-zinc-100" />
              <div className="h-5 w-16 rounded bg-zinc-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
