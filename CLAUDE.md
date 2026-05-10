# BNBC Seismic Calculator for ETABS

## Project Overview
- **Type:** Next.js 14 Web Application (App Router)
- **Purpose:** Calculate seismic loads per BNBC 2020 for structural engineers in Bangladesh
- **Target Users:** Structural engineers who need ETABS-compatible seismic parameters

## Tech Stack
- Next.js 14.2.0 (App Router)
- TypeScript
- Tailwind CSS
- React Context for state management

## Project Structure
```
src/
├── app/
│   ├── globals.css      # Tailwind + custom engineering styles
│   ├── layout.tsx        # Root layout with SeismicProvider
│   └── page.tsx         # Main wizard UI (6 steps)
├── components/
│   ├── ui/Input.tsx     # Form components (Input, Select, Button, Card)
│   ├── StepIndicator.tsx # Sidebar navigation
│   └── steps/           # 6 step components
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
- Location data (Dhaka Z=0.20, Chittagong Z=0.15, etc.)
- Site coefficients Fa (Table 6.4.1), Fv (Table 6.4.2)
- Seismic systems with R, Ω₀, Cd values (Table 6.5.1)
- Importance factors by occupancy category
- Site class determination from SPT-N

### `src/lib/calculations.ts` - Core Calculations
- `calculateSeismicParameters()` - Main function returning all results
- `calculateNavg()` - Average SPT-N from soil data
- `calculateTa()` - Approximate fundamental period
- `generateETABSOutput()` - Formatted text for ETABS import
- Formulas: SDS = (2/3) × Fa × Z, SD1 = (2/3) × Fv × Z, V = Cs × W

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
4. Commit and push to GitHub

### Important Engineering Notes
- All calculations use client-side (no backend)
- BNBC 2020 values are hardcoded - verify against official code if updating
- Site Class F requires special geotechnical analysis (returns Cs=0)
- Default spectral accelerations: Ss=1.0g, S1=0.4g (conservative for Bangladesh)
- Building weight W = Dead Load + 25% Live Load per BNBC 6.4.2

### Design Guidelines
- Use emerald green (#059669) as primary color (engineering feel)
- JetBrains Mono for numbers/tables, Inter for UI text
- Results page should resemble ETABS Seismic Loading dialog
- Keep real-time updates - every input change recalculates immediately