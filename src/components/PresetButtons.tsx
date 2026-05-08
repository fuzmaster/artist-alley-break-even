import { productPresets } from '../data/productPresets'

type PresetButtonsProps = {
  onSelect: (
    productName: string,
    averageSalePrice: number,
    averageItemCost: number,
  ) => void
}

export function PresetButtons({ onSelect }: PresetButtonsProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-200">Quick product presets</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {productPresets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() =>
              onSelect(preset.label, preset.averageSalePrice, preset.averageItemCost)
            }
            className="rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs font-medium text-slate-100 transition hover:border-fuchsia-400 hover:text-fuchsia-200"
          >
            <span className="block">{preset.label}</span>
            <span className="block text-slate-400">
              ${preset.averageSalePrice} / ${preset.averageItemCost}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
