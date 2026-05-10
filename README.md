# BNBC Seismic Calculator for ETABS

A web-based seismic load calculator for structural engineers in Bangladesh, based on the Bangladesh National Building Code (BNBC) 2020. Designed to generate ETABS-compatible seismic parameters.

## 🌐 Live Demo

**Visit:** https://seismicloadcal.netlify.app

---

## 📋 What Does This Calculator Do?

This tool helps structural engineers calculate seismic loads for buildings in Bangladesh. It takes building information as input and outputs all the parameters needed for ETABS seismic analysis:

- **Seismic Zone Coefficient (Z)** - Based on location
- **Site Class** - From soil data (SPT-N values)
- **Spectral Acceleration (SDS, SD1)** - Design values
- **Seismic Design Category (SDC)** - Building classification
- **Base Shear (V)** - Total lateral force
- **System Factors (R, Ω₀, Cd)** - Based on lateral system type

---

## 🚀 How to Use

### Step 1: Project Information
- Enter project name
- Select location (Dhaka, Chittagong, Sylhet, etc.)
- Choose Occupancy Category (I-V)
- Select Wind Exposure Category

### Step 2: Building Geometry
- Enter number of stories
- Enter floor height (m)
- Enter floor area (m²)
- Enter plan dimensions (optional)

### Step 3: Soil Data
- Enter SPT-N values at different depths (optional)
- Or select Site Class manually
- Auto-calculates average N-value and Site Class

### Step 4: Seismic System
- Select lateral force-resisting system type
- Auto-fills R, Ω₀, Cd values from BNBC 2020 Table 6.5.1

### Step 5: Loads
- Enter Dead Load, Live Load
- Auto-calculates total building weight

### Step 6: Results
- View all calculated seismic parameters
- **Copy All for ETABS** - One-click copy of all parameters
- Individual copy buttons for each value

---

## 📊 BNBC 2020 Reference

### Seismic Zones (Table 6.2.1)
| Location | Zone Coefficient (Z) |
|----------|---------------------|
| Dhaka    | 0.20                |
| Chittagong | 0.15              |
| Sylhet   | 0.15                |
| Khulna   | 0.15                |
| Barisal  | 0.12                |
| Rangpur  | 0.12                |
| Mymensingh | 0.15             |

### Seismic Systems (Table 6.5.1)
| System | R | Ω₀ | Cd |
|--------|---|----|----|
| Special Moment Frame (SMF) | 8 | 3 | 5.5 |
| Ordinary Moment Frame (OMF) | 3 | 3 | 2.5 |
| Special Concentric Braced | 6 | 2 | 5 |
| Special Shear Wall | 6 | 2.5 | 5 |
| Dual System with SMF | 8 | 2.5 | 5.5 |

### Key Formulas
- **SDS** = (2/3) × Fa × Z
- **SD1** = (2/3) × Fv × Z
- **Cs** = SD1 / (R/I) (with min/max limits)
- **V** = Cs × W (Base Shear)

---

## 💻 For Developers

### Tech Stack
- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS
- **State:** React Context
- **Theming:** next-themes (Dark/Light mode)
- **Icons:** Lucide React

### Installation

```bash
# Clone the repository
git clone https://github.com/muhammadmahadi0/seismicLoadCalculator.git

# Navigate to project
cd seismicLoadCalculator

# Install dependencies
npm install

# Run development server
npm run dev
```

### Build for Production

```bash
npm run build
npm start
```

### Key Files
- `src/lib/bnbc-data.ts` - BNBC 2020 tables and constants
- `src/lib/calculations.ts` - Seismic calculation logic
- `src/components/steps/Results.tsx` - ETABS-style results display

---

## 🎨 Design Features

- **Dark Mode** - Toggle button in bottom-right corner
- **Real-time Updates** - Calculations update as you type
- **ETABS-style Output** - Professional format ready for ETABS import
- **Responsive** - Works on desktop and tablet

---

## ⚠️ Disclaimer

This calculator implements BNBC 2020 provisions for seismic design. Always verify results with a qualified structural engineer. For complex projects, site-specific geotechnical analysis is required.

---

## 📝 License

MIT License - Feel free to use and modify.

---

## 👨‍💻 Created By

Muhammad Mahadi
- GitHub: [@muhammadmahadi0](https://github.com/muhammadmahadi0)

Built with Next.js and Tailwind CSS
