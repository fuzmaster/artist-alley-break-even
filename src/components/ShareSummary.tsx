type ShareSummaryProps = {
  onCopy: () => void
  onReset: () => void
  onExportCsv: () => void
  copyStatus: string | null
}

export function ShareSummary({ onCopy, onReset, onExportCsv, copyStatus }: ShareSummaryProps) {
  return (
    <section className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={onCopy}
        className="rounded-xl border border-fuchsia-400 bg-fuchsia-500/20 px-4 py-2 text-sm font-semibold text-fuchsia-100 transition hover:bg-fuchsia-500/35 focus-visible:ring-2 focus-visible:ring-fuchsia-500/60 outline-none"
      >
        Copy Summary
      </button>
      <button
        type="button"
        onClick={onExportCsv}
        className="rounded-xl border border-sky-500/50 bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-200 transition hover:bg-sky-500/20"
      >
        Download CSV
      </button>
      <button
        type="button"
        onClick={onReset}
        className="rounded-xl border border-slate-600 bg-slate-900/70 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-slate-400"
      >
        Reset
      </button>
      {copyStatus ? (
        <p aria-live="polite" className="self-center text-sm text-slate-300">
          {copyStatus}
        </p>
      ) : null}
    </section>
  )
}
