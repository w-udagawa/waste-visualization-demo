/**
 * marumie Design System Theme Configuration
 */

import { marumieColors } from './colors';

export const theme = {
  colors: marumieColors,
  spacing: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    xxl: '3rem',    // 48px
  },
  borderRadius: {
    sm: '0.25rem',  // 4px
    md: '0.5rem',   // 8px
    lg: '0.75rem',  // 12px
    xl: '1rem',     // 16px
    full: '9999px',
  },
  fontSize: {
    xs: '0.75rem',   // 12px
    sm: '0.875rem',  // 14px
    base: '1rem',    // 16px
    lg: '1.125rem',  // 18px
    xl: '1.25rem',   // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

export type Theme = typeof theme;

// KPI表示用のスタイル設定
export const kpiStyles = {
  card: {
    excellent: 'bg-green-50 border-green-500',
    good: 'bg-green-50 border-green-400',
    average: 'bg-yellow-50 border-yellow-500',
    poor: 'bg-orange-50 border-orange-500',
    critical: 'bg-red-50 border-red-500',
  },
  text: {
    excellent: 'text-green-700',
    good: 'text-green-600',
    average: 'text-yellow-700',
    poor: 'text-orange-700',
    critical: 'text-red-700',
  },
  badge: {
    excellent: 'bg-green-100 text-green-800',
    good: 'bg-green-100 text-green-700',
    average: 'bg-yellow-100 text-yellow-800',
    poor: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800',
  },
} as const;

// グラフ用のカラーパレット
export const chartColors = [
  marumieColors.primary[500],
  marumieColors.success[500],
  marumieColors.warning[500],
  marumieColors.danger[500],
  marumieColors.primary[700],
  marumieColors.success[700],
  marumieColors.warning[700],
  marumieColors.danger[700],
] as const;

// 廃棄物種類別のカラーマッピング
export const wasteTypeColors = {
  concrete: marumieColors.waste.concrete,
  wood: marumieColors.waste.wood,
  metal: marumieColors.waste.metal,
  plastic: marumieColors.waste.plastic,
  paper: marumieColors.waste.paper,
  mixed: marumieColors.waste.mixed,
  glass: marumieColors.waste.glass,
  other: marumieColors.waste.other,
} as const;