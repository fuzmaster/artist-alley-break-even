import type { ReactNode } from 'react'

type FieldGroupProps = {
  index: string | number
  title: string
  children: ReactNode
}

export function FieldGroup({ index, title, children }: FieldGroupProps) {
  return (
    <section style={{ borderTop: '1px solid var(--border)', paddingTop: 20, marginTop: 20 }}>
      <h3 style={{
        display: 'flex', alignItems: 'center', gap: 10, margin: '0 0 14px',
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
          width: 24, height: 24, borderRadius: 7,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--accent)', background: 'var(--accent-soft)',
          border: '1px solid color-mix(in oklab, var(--accent) 40%, transparent)',
          flex: 'none',
        }}>
          {index}
        </span>
        {title}
      </h3>
      <div style={{ display: 'grid', gap: 14 }}>{children}</div>
    </section>
  )
}
