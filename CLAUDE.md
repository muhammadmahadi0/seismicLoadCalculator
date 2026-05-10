# BNBC Seismic Calculator for ETABS

## Project Overview
- **Type:** Next.js 14 Web Application (App Router)
- **Purpose:** Calculate seismic loads per BNBC 2020 for structural engineers in Bangladesh
- **Target Users:** Structural engineers who need ETABS-compatible seismic parameters
- **Live URL:** https://seismic-load-calculator.netlify.app

## Tech Stack
- Next.js 14.2.0 (App Router)
- TypeScript
- Tailwind CSS
- React Context for state management
- next-themes for dark mode
- lucide-react for icons

## Project Structure
```
src/
├── app/
│   ├── globals.css      # Tailwind + custom engineering styles + dark mode
│   ├── layout.tsx       # Root layout with ThemeProvider, SeismicProvider
│   └── page.tsx         # Main wizard UI (6 steps)
├── components/
│   ├── ui/Input.tsx     # Form components (Input, Select, Button, Card) with dark:
│   ├── StepIndicator.tsx # Sidebar navigation with dark mode
│   ├── ThemeProvider.tsx # next-themes provider (defaultTheme="light")
│   ├── ThemeToggle.tsx  # Floating dark mode toggle button (bottom-right)
│   └── steps/           # 6 step components with full dark mode support
│       ├── ProjectInfo.tsx
│       ├── BuildingInfo.tsx
│       ├── SoilData.tsx
│       ├── SeismicSystem.tsx
│       ├── Loads.tsx
│       └── Results.tsx
├── context/
│   └── SeismicContext.tsx # Global state (formData, results, step navigation)
├── lib/
│   ├── bnbc-data.ts     # BNBC 2020 tables (Fa, Fv, R, Ω₀, Cd values, locations)
│   └── calculations.ts  # All seismic calculations + ETABS export
└── types/
    └── index.ts         # TypeScript interfaces
```

## Key Files & Their Purpose

### `src/lib/bnbc-data.ts` - BNBC 2020 Data
- Location data with seismic zones (Table 6.2.14): Dhaka Zone 2 (Z=0.20), Chittagong Zone 3 (Z=0.28), Sylhet Zone 4 (Z=0.36), etc.
- Site coefficients Fa (Table 6.4.1), Fv (Table 6.4.2)
- Normalized response spectrum coefficients (S, TB, TC, TD) by Site Class
- Seismic systems with R, Ω₀, Cd values (Table 6.5.1)
- Importance factors by occupancy category (Table 6.1.1)
- Site class determination from SPT-N

### `src/lib/calculations.ts` - Core Calculations (BNBC 2020 Compliant)
- `calculateSeismicParameters()` - Main function returning all results
- `calculateNavg()` - Average SPT-N from soil data
- `calculateTa()` - Approximate fundamental period (BNBC 6.4.3.1)
- `calculateCs()` - Normalized acceleration response spectrum
- `calculateSa()` - Design spectral acceleration: S_a = (2/3) × Z × I × C_s
- `generateETABSOutput()` - Formatted text for ETABS import
- Formulas:
  - SDS = (2/3) × Fa × Z
  - SD1 = (2/3) × Fv × Z
  - C_s (normalized response spectrum per BNBC 6.2.3)
  - S_a = (2/3) × Z × I × C_s (Design Spectral Acceleration)
  - V = S_a × W (Base Shear per BNBC 2020)

### `src/context/SeismicContext.tsx` - State Management
- `formData` - All user inputs (project, geometry, SPT, system, loads)
- `results` - Calculated seismic parameters (auto-updates on input change)
- `currentStep` - Wizard step (1-6)
- `buildingHeight` - stories × floorHeight

### `src/components/steps/Results.tsx` - Most Important Component
- ETABS-style display: Left panel (R, Ω₀, Cd, I), Right panel (Ss, S1, Site Class, Fa, Fv, SDS, SD1)
- Copy buttons for each value
- "Copy All for ETABS" button with formatted output
- Base Shear (V), SDC, total weight display

## Dark Mode Implementation

### Configuration Files:
- **tailwind.config.js**: `darkMode: 'class'` (critical!)
- **ThemeProvider.tsx**: Wraps app, defaultTheme="light", uses localStorage
- **ThemeToggle.tsx**: Floating circular button (fixed bottom-6 right-6)

### How Dark Mode Works:
1. `next-themes` adds/removes "dark" class on `<html>`
2. Tailwind's `dark:` prefix applies styles when dark class is present
3. Theme preference saved in localStorage (`bnbc-seismic-theme`)
4. Respects saved preference on reload (no flicker when properly configured)

### Dark Mode Classes Used:
- Backgrounds: `bg-slate-50` (light) / `dark:bg-slate-900` (dark)
- Cards: `bg-white` (light) / `dark:bg-slate-800` (dark)
- Text: `text-slate-800` (light) / `dark:text-slate-100` (dark)
- Borders: `border-slate-200` (light) / `dark:border-slate-700` (dark)

## How to Work On This

### Running Locally
```bash
cd F:\claudeProjects\seismicLoadCalculator
npm run dev
# Opens at http://localhost:3000
```

### Making Changes
1. Edit relevant component in `src/components/steps/`
2. To modify calculations, edit `src/lib/calculations.ts` or `src/lib/bnbc-data.ts`
3. Test with `npm run build` (type checking)
4. Commit and push to GitHub - Netlify auto-deploys

### Important Engineering Notes
- All calculations use client-side (no backend)
- BNBC 2020 values are hardcoded - verify against official code if updating
- Site Class F: Shows warning and allows manual entry of S, TB, TC, TD coefficients from site-specific study, or returns zero base shear
- Default spectral accelerations: Ss=1.0g, S1=0.4g (conservative for Bangladesh)
- Building weight W = Dead Load + 25% Live Load per BNBC 6.4.2
- Seismic Design Category (SDC) determined per BNBC 6.6.1 & 6.6.2
- Normalized response spectrum C_s calculation per BNBC 6.2.3:
  - 0 ≤ T ≤ TB: C_s = S × [1 + (T/TB) × (η×2.5 - 1)]
  - TB ≤ T ≤ TC: C_s = S × η × 2.5
  - TC ≤ T ≤ TD: C_s = S × η × 2.5 × (TC/T)
  - T > TD: C_s = S × η × 2.5 × (TC × TD) / T²

### Design Guidelines
- Use emerald green (#059669) as primary color (engineering feel)
- JetBrains Mono for numbers/tables, Inter for UI text
- Results page should resemble ETABS Seismic Loading dialog
- Keep real-time updates - every input change recalculates immediately
- Dark mode uses slate color palette: slate-900 bg, slate-800 cards

## Git Workflow
```bash
# Make changes
git add -A
git commit -m "Description of changes"
git push
# Netlify auto-deploys from main branch
```