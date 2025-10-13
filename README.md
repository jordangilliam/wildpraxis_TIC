# wildpraxisTIC

Open‑source, Pittsburgh‑focused Trout‑in‑the‑Classroom dashboard with games, macro ID, habitat builder, watershed explorer, and careers/internships feed.

## Quickstart

```bash
npm i
npm run dev
```

Visit http://localhost:5173

- Enter a **Mapbox token** in the sidebar to enable the map.
- Logos live in `public/branding/`.
- Demo data for opportunities is in `public/data/opportunities.json` (refreshed weekly by a GitHub Action).

## Deploy (GitHub Pages)

Push to `main`. The workflow `.github/workflows/deploy.yml` builds and publishes to GitHub Pages.
Set your repo **Settings → Pages → Source: GitHub Actions**.

## Weekly Sync

`.github/workflows/weekly-opportunities.yml` runs `scripts/sync-opportunities.mjs` each Monday 12:00 UTC and commits any changes to `public/data/opportunities.json`.

## Tech

Vite + React + Tailwind + Recharts + Mapbox GL. Minimal shadcn‑style UI primitives are included locally under `src/components/ui` for zero setup.

## License

MIT — see `LICENSE` (downloadable from the footer at runtime).


### Live sources
- Edit `public/data/opportunity_sources.json` with your Google Sheet CSV URL and/or a JSON URL.
- Run locally: `npm run sync:opportunities` (or let the weekly Action run).
