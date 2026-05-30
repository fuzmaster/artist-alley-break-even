import type { ConSize } from '../types/calculator'
import { CON_PRESETS } from '../lib/conPresets'

type ConPresetPickerProps = {
  value: ConSize
  pending: ConSize | null
  onPick: (con: ConSize) => void
  onLoad: (con: ConSize) => void
  onKeep: () => void
}

export function ConPresetPicker({ value, pending, onPick, onLoad, onKeep }: ConPresetPickerProps) {
  const keys: ConSize[] = ['small', 'mid', 'major']
  return (
    <div>
      <div className="seg">
        {keys.map((k) => {
          const p = CON_PRESETS[k]
          const checked = value === k
          return (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={checked}
              className="seg-item"
              onClick={() => onPick(k)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <span className="seg-item__title">{p.label}</span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11,
                  color: checked ? 'var(--accent)' : 'var(--text-faint)',
                }}>
                  {p.days}d · ${p.tableFee} table
                </span>
              </div>
              <div className="seg-item__sub">{p.blurb}</div>
            </button>
          )
        })}
      </div>
      {pending && (
        <div
          role="status"
          style={{
            marginTop: 10, padding: '10px 14px',
            background: 'color-mix(in oklab, var(--accent) 10%, var(--panel-3))',
            border: '1px solid color-mix(in oklab, var(--accent) 30%, transparent)',
            borderRadius: 12, fontSize: 13,
          }}
        >
          <span style={{ color: 'var(--text-dim)' }}>Load {CON_PRESETS[pending].label} defaults? </span>
          <button
            type="button"
            onClick={() => onLoad(pending)}
            style={{ color: 'var(--accent)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            Load
          </button>
          {' · '}
          <button
            type="button"
            onClick={onKeep}
            style={{ color: 'var(--text-faint)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            Keep mine
          </button>
        </div>
      )}
    </div>
  )
}
