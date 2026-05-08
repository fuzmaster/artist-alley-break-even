type WarningBoxProps = {
  message: string
}

export function WarningBox({ message }: WarningBoxProps) {
  return (
    <div className="rounded-2xl border border-rose-500/50 bg-rose-500/10 p-4 text-sm text-rose-100">
      {message}
    </div>
  )
}
