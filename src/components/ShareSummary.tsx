type ShareSummaryProps = {
  onCopy: () => void
  onReset: () => void
  copyStatus: string | null
}

export function ShareSummary({ onCopy, onReset, copyStatus }: ShareSummaryProps) {
  return (
    <section className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={onCopy}
        className="rounded-xl border border-fuchsia-400 bg-fuchsia-500/20 px-4 py-2 text-sm font-semibold text-fuchsia-100 transition hover:bg-fuchsia-500/35"
      >
        Copy Summary
      </button>
      <button
        type="button"
        onClick={onReset}
        className="rounded-xl border border-slate-600 bg-slate-900/70 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-slate-400"
      >
        Reset
      </button>
      {copyStatus ? <p className="self-center text-sm text-slate-300">{copyStatus}</p> : null}
    </section>
  )
}
