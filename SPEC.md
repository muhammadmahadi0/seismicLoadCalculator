# BNBC Seismic Calculator for ETABS - Specification

## Project Overview
- **Project Name:** BNBC Seismic Calculator for ETABS
- **Type:** Web Application (Next.js 14 App Router)
- **Core Functionality:** Multi-step wizard for BNBC 2020 seismic load calculations with ETABS export
- **Target Users:** Structural Engineers in Bangladesh

## UI/UX Specification

### Layout Structure
- **Sidebar Navigation:** Fixed left sidebar (280px) with step indicators
- **Main Content Area:** Right side, scrollable form content
- **Results Panel:** Collapsible right panel (400px) showing live calculations
- **Responsive:** Sidebar collapses to top nav on mobile (<768px)

### Visual Design

#### Color Palette
- **Primary:** `#059669` (Emerald-600 - engineering green)
- **Primary Dark:** `#047857` (Emerald-700)
- **Primary Light:** `#D1FAE5` (Emerald-100)
- **Background:** `#F8FAFC` (Slate-50)
- **Card Background:** `#FFFFFF`
- **Text Primary:** `#1E293B` (Slate-800)
- **Text Secondary:** `#64748B` (Slate-500)
- **Border:** `#E2E8F0` (Slate-200)
- **Accent:** `#F59E0B` (Amber-500 for warnings)
- **Error:** `#EF4444` (Red-500)
- **Success:** `#10B981` (Emerald-500)

#### Typography
- **Font Family:** "JetBrains Mono" for numbers/tables, "Inter" for UI text
- **Headings:** Inter, 600 weight
  - H1: 28px
  - H2: 22px
  - H3: 18px
- **Body:** Inter, 400 weight, 14px
- **Labels:** Inter, 500 weight, 13px
- **Monospace (numbers):** JetBrains Mono, 14px

#### Spacing
- Base unit: 4px
- Card padding: 24px
- Section gap: 32px
- Input spacing: 16px

#### Visual Effects
- Card shadows: `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)`
- Hover states: slight scale (1.01) + shadow increase
- Transitions: 200ms ease-out
- Step indicators: animated checkmarks

### Components

#### Sidebar Steps
- 7 steps with icons and labels
- Active step: green highlight with left border
- Completed steps: green checkmark icon
- Click to navigate between completed steps

#### Form Cards
- White background, subtle shadow
- Section headers with blue accent line
- Input groups with labels above
- Dropdowns with custom styling
- Tables with alternating row colors

#### SPT-N Table
- Editable cells with inline editing
- Auto-calculated d/N values
- Auto Site Class result (A-F)
- Add/Remove row buttons
- Minimum 3, maximum 10 rows

#### Results Panel
- Sticky on right side
- Collapsible on mobile
- Real-time updates with every input change
- Copy buttons for each section
- Export buttons at bottom

#### Buttons
- Primary: Green background, white text
- Secondary: White background, green border
- States: hover (darker), disabled (grayed)

## Functionality Specification

### Steps in Wizard

#### Step 1: Project Information
- Project Name (text input)
- Location dropdown (with Z prefill):
  - Dhaka (Z=0.20)
  - Chittagong (Z=0.15)
  - Sylhet (Z=0.15)
  - Khulna (Z=0.15)
  - Barisal (Z=0.12)
  - Rangpur (Z=0.12)
  - Mymensingh (Z=0.15)
- Occupancy Category dropdown:
  - I (Essential Facilities)
  - II ( Hazardous Facilities)
  - III (Special Structures)
  - IV (Standard Structures)
  - V (Miscellaneous Structures)
- Exposure Category (Wind): A, B, C, D

#### Step 2: Building Geometry
- Number of Stories (number, 1-50)
- Floor Height (ft, default 10)
- Total Height (calculated: stories × floor height)
- Slab Area (m²)
- Optional: Plan dimensions (Lx, Ly)

#### Step 3: Soil / SPT Data
- SPT-N Table:
  - Column 1: Depth (m)
  - Column 2: SPT N-value
  - Column 3: d/N (auto-calculated: depth/N)
  - Column 4: Site Class (auto-calculated from average N)
- Alternative: Direct Soil Type dropdown (SA, SB, SC, SD, SE, SF)

#### Step 4: Seismic Force-Resisting System
- System Type dropdown with R, Ω0, Cd values:
  - Special Moment Resisting Frame (R=8, Ω0=3, Cd=5.5)
  - Ordinary Moment Resisting Frame (R=3, Ω0=3, Cd=2.5)
  - Special Concentric Braced Frame (R=6, Ω0=2, Cd=5)
  - Ordinary Concentric Braced Frame (R=3.5, Ω0=3, Cd=3)
  - Eccentric Braced Frame (R=7, Ω0=2.5, Cd=4)
  - Special Shear Wall (R=6, Ω0=2.5, Cd=5)
  - Ordinary Shear Wall (R=4, Ω0=2.5, Cd=4)
  - Dual System with SMF (R=8, Ω0=2.5, Cd=5.5)
- Also show Equivalent System options

#### Step 5: Loads
- Dead Load (kN/m², default 12)
- Live Load (kN/m², default 3)
- Additional Dead Load (kN/m², default 2)
- Total Dead Load calculated

#### Step 6: Results
- Seismic Design Parameters display
- Base Shear calculation
- Story Forces distribution
- ETABS text generation
- Copy to clipboard
- Export to PDF (basic HTML print)

### Calculations (BNBC 2020)

#### Site Class Determination
- Average SPT-N for top 30m: Navg = ΣN / count
- Site Class from BNBC Table 6.3.1:
  - A: Navg > 50 (hard rock)
  - B: Navg 16-50 (rock)
  - C: Navg 8-16 (very dense soil/soft rock)
  - D: Navg < 8 (stiff soil)
  - E: Soft clay > 10m with SPT-N < 20
  - F: Special soils (liquefaction, etc.)

#### Seismic Coefficients
- Seismic Zone (Z): from location (0.12-0.20)
- Site Coefficients Fa, Fv from BNBC Tables 6.4.1, 6.4.2 based on Site Class
- SDS = (2/3) × Fa × Z × g (or simplified: 1.33 × Fa × Z)
- SD1 = (2/3) × Fv × Z × g (or: 1.33 × Fv × Z)

#### Seismic Design Category
- From SDS, SD1 and Occupancy Category (Table 6.6.1, 6.6.2)

#### Base Shear
- Cs = SD1 / (R/Ie) (with T, SD1 limits per 6.4.2)
- Cs_min = max(0.044 × SDS × Ie, 0.01)
- Cs_max = SDS / (R/Ie)
- V = Cs × W (total seismic weight)

#### ETABS Output
Generate text for ETABS analysis parameters including:
- Seismic Load Factor
- Response Spectrum Data
- Story Shear distribution
- Equivalent Static Force parameters

### Edge Cases
- Invalid SPT values (negative, zero)
- Missing required fields
- Calculation warnings (e.g., very tall building for category)
- Site Class F special handling

## Acceptance Criteria

### Visual Checkpoints
- [ ] Sidebar shows all 6 steps with proper active/completed states
- [ ] Form inputs are properly styled and aligned
- [ ] SPT table allows editing and shows calculated d/N
- [ ] Results panel updates in real-time
- [ ] Numbers displayed in monospace font
- [ ] Green accent color consistent throughout

### Functional Checkpoints
- [ ] Can navigate between steps
- [ ] All dropdowns populate with correct options
- [ ] Site Class calculates from SPT-N average
- [ ] Seismic coefficients (Fa, Fv) based on Site Class
- [ ] Base Shear calculates correctly
- [ ] Copy buttons work for all sections
- [ ] Export generates printable content

### Engineering Accuracy
- [ ] BNBC 2020 values for all tables
- [ ] Correct formulas for SDS, SD1, Cs, V
- [ ] Proper R, Ω0, Cd values for each system type
- [ ] Accurate location-based Z values