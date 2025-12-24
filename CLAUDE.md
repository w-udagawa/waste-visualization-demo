# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Waste Visualization Demo** (廃棄物見える化モデル・デモ版) - A Next.js 15 web application for visualizing waste management KPIs across construction sites, branches, and company-wide levels.

**Tech Stack:**
- Next.js 15 (App Router) + React 19 + TypeScript
- CSV-based data storage (no database required)
- Tailwind CSS (marumie design system)
- Recharts (data visualization)

## Essential Commands

```bash
npm run dev      # Start dev server with Turbopack (localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture Overview

### Data Flow

```
data/*.csv → lib/data/csvLoader.ts → lib/kpi/calculator.ts → API Routes → Components
```

### Three-Tier KPI System

1. **Company Level** - 全社 (SITE_COMPANY)
2. **Branch Level** - 土木部門/建築部門 (DEPT001, DEPT002)
3. **Site Level** - Individual construction sites

### CSV Data Files (`data/`)

| File | Description |
|------|-------------|
| `branches.csv` | Branch master (id, code, name, region) |
| `sites.csv` | Site master (id, code, name, branch_id, etc.) |
| `waste-records.csv` | Waste transaction data (site_code, year_month, waste_type, weights) |

**To update data:** Edit CSV files directly and redeploy.

### KPI Calculations (`lib/kpi/`)

- **Sorting Rate** (分別率): `sortedWeight / totalWeight × 100`
- **Real Recycling Rate** (実質再資源化率): `recycledWeight / totalWeight × 100`
- **Final Disposal Rate** (最終処分率): `finalDisposalWeight / totalWeight × 100`
- **Waste Intensity** (原単位): `totalWeight(t) / constructionAmount(億円)`

### API Routes

| Endpoint | Description |
|----------|-------------|
| `GET /api/kpi/company?yearMonth=YYYY-MM` | Company-wide KPI |
| `GET /api/kpi/branches?yearMonth=YYYY-MM` | All branch KPIs |
| `GET /api/kpi/trend?type=company&months=6` | KPI trend data |
| `GET /api/waste-flow?yearMonth=YYYY-MM` | Sankey diagram data |

### marumie Design System (`lib/styles/colors.ts`)

KPI color thresholds:
- **Excellent**: Green (#00E676)
- **Good**: Green (#4CAF50)
- **Average**: Amber (#FFB300)
- **Poor**: Orange (#FF6F00)
- **Critical**: Red (#F44336)

## File Organization

```
app/                     # Next.js App Router pages
  ├── page.tsx           # Company dashboard (/)
  ├── branches/          # Branch views (/branches, /branches/[id])
  ├── sites/             # Site views (/sites, /sites/[id])
  └── api/               # API routes

components/
  ├── ui/                # Primitive components (Button, Card, etc.)
  ├── layout/            # Layout components (Header, Footer)
  └── dashboard/         # Business components (KPICard, TrendGraph, etc.)

data/                    # CSV data files
lib/
  ├── data/csvLoader.ts  # CSV loading functions
  ├── kpi/               # KPI calculation engine
  ├── styles/            # Design system
  └── utils.ts           # Utility functions
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Deploy (no environment variables needed)

Data updates: Edit CSV → Push to GitHub → Auto-redeploy

## Development Notes

- **Path aliases**: Use `@/` for imports (e.g., `@/lib/utils`)
- **Date formatting**: Use utilities in `lib/utils.ts` for Japanese locale
- **KPI calculations**: Always use `lib/kpi/calculator.ts`, never calculate in components
- **Type safety**: All KPI functions return strongly-typed interfaces

## Current 2024 FY Data

| Branch | Total Waste | Recycling Rate | Final Disposal Rate |
|--------|-------------|----------------|---------------------|
| 全社 | 121,151 t | 94.6% | 5.4% |
| 土木部門 | 44,941 t | 96.4% | 3.6% |
| 建築部門 | 76,210 t | 93.5% | 6.5% |

**Waste Types (11 categories):**
汚泥, コンクリートガラ, アスコンガラ, プラスチック, 木くず, 混合廃棄物, 金属くず, 紙くず, 廃石膏ボード, ガラス・陶磁器くず, その他がれき類
