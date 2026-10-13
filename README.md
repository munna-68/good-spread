# Good Spread — Alder Catering Clone (portfolio demo)

1:1 rebuild of `https://freshbakes.store/aldercatering/` with **React 18 + Vite + TypeScript** and plain CSS (design tokens ported from the original `alder.css`).

- `ALDER-CLONE-SPEC.md` — full clone spec (copy, prices, math, responsive rules)
- `screenshots/` — reference captures from the live site

## Run it

```bash
npm install
npm run dev      # http://127.0.0.1:5173/
npm run build    # production build → dist/
npm run preview  # preview the build
```

## What's implemented

- Sticky announcement + header (cart badge, burger + mobile nav sheet)
- Hero with rotating headlines, live planner (headcount stepper, date rules, serve times, delivery/pickup, ZIP logic), trust stats, photo mosaic
- 10-package menu with category + dietary filters, per-guest pricing scaled to headcount
- Sticky order sheet (desktop), mobile order bar, checkout drawer with totals math (`$250` min, free delivery over `$500`, `8.25%` tax)
- Occasions, 5-step quote builder with live estimate, office-account mock with reorders, reviews, ZIP checker + FAQ, final CTA, footer
- Light + dark themes via CSS vars, full mobile layout (swipe rows, compact cards, bottom-sheet checkout)

All state is client-side demo data — no backend.
