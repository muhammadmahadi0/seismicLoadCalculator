# BNBC Seismic Calculator for ETABS — Agent Guide

## Project Overview
A Next.js 14 web application that calculates seismic loads per BNBC 2020 for structural engineers in Bangladesh.

## Tech Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (dark mode via `class` strategy)
- next-themes, lucide-react

## File Structure
```
src/
├── app/
│   ├── globals.css         # Tailwind + custom styles + dark mode
│   ├── layout.tsx          # Root layout with ThemeProvider, SeismicProvider
│   └── page.tsx            # Main wizard UI (6 steps + sidebar + progress)
├── components/
│   ├── ui/Input.tsx        # Form components (Input, Select, Button, Card)
│   ├── StepIndicator.tsx   # Sidebar navigation (hidden on mobile)
│   ├── ThemeProvider.tsx
│   ├── ThemeToggle.tsx     # Floating dark mode toggle (bottom-right)
│   └── steps/              # 6 wizard step components
│       ├── ProjectInfo.tsx
│       ├── BuildingInfo.tsx
│       ├── SoilData.tsx
│       ├── SeismicSystem.tsx
│       ├── Loads.tsx
│       └── Results.tsx
├── context/
│   └── SeismicContext.tsx  # Global state (formData, results, step nav)
├── lib/
│   ├── bnbc-data.ts        # BNBC 2020 tables (Fa, Fv, R, zones, etc.)
│   └── calculations.ts     # All seismic calculations + ETABS export
└── types/
    └── index.ts            # TypeScript interfaces
```

## Mobile Responsiveness
- Sidebar hidden on mobile (`hidden lg:block`), top step indicator suffices
- All grids use responsive breakpoints (sm/md/lg)
- Padding scales: `p-4 md:p-8`
- Titles: `text-xl md:text-2xl` or `md:text-3xl`
- Step circles: `w-8 h-8 md:w-10 md:h-10`
- All buttons full-width on mobile where appropriate

## Key Conventions
- **NO logic in template/CSS changes** — logic lives in `lib/calculations.ts` and `context/`
- Dark mode: `dark:` prefix classes, `dark` class on `<html>`
- Primary color: emerald green (#059669)
- Fonts: Inter (UI), JetBrains Mono (numbers/tables)

## Git
- Remote: https://github.com/muhammadmahadi0/seismicLoadCalculator
- Live: https://seismic-load-calculator.netlify.app
