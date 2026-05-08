# Artist Alley Break-Even Calculator

A one-page Vite + React calculator that helps Artist Alley vendors estimate how many items they need to sell at an anime convention before they break even.

## What it does

This app combines convention costs, item economics, and selling time to answer:

- How many items you need to sell to break even
- How many sales per day that target requires
- How many sales per hour that pace requires

It also warns when your margin is zero/negative or your sales pace may be unrealistic.

## Tech stack

- Vite
- React
- TypeScript
- Tailwind CSS
- localStorage for client-side persistence

## Local setup

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Deployment notes (Vercel)

Use the default Vite settings in Vercel:

- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`

No backend, API keys, auth, or database configuration is required.

## Feature list

- Mobile-first responsive one-page dashboard
- Live break-even calculations
- Product preset buttons (Sticker, Charm, Print, Commission)
- Editable preset values after selection
- Live average profit per item
- Large result card for easy screenshots
- Sticky desktop result panel
- Copy Summary button for sharing estimates
- Reset button
- Input persistence with localStorage
- Safety checks for divide-by-zero and invalid values
- Warning messages for negative/zero margin and unrealistic sales pace

## Future upgrade ideas

- Multiple product mixes with weighted margin
- Per-day traffic assumptions and conversion rates
- Save/load named convention scenarios
- CSV export for planning spreadsheet workflows
- Optional dark/light theme toggle
