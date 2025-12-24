/**
 * marumie Design System Colors
 * 建設業界向けの落ち着いた配色
 */
export const marumieColors = {
  primary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#2196F3', // メインブルー
    600: '#1E88E5',
    700: '#1976D2',
    800: '#1565C0',
    900: '#0D47A1',
  },
  success: {
    50: '#E8F5E9',
    100: '#C8E6C9',
    300: '#81C784',
    500: '#4CAF50', // 緑（目標達成・良好）
    700: '#388E3C',
    900: '#1B5E20',
  },
  warning: {
    50: '#FFF3E0',
    100: '#FFE0B2',
    300: '#FFB74D',
    500: '#FF9800', // オレンジ（注意）
    700: '#F57C00',
    900: '#E65100',
  },
  danger: {
    50: '#FFEBEE',
    100: '#FFCDD2',
    300: '#EF5350',
    500: '#F44336', // 赤（警告）
    700: '#D32F2F',
    900: '#B71C1C',
  },
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  // KPI用の特別な色
  kpi: {
    excellent: '#00E676', // 目標を大幅に上回る
    good: '#4CAF50',      // 目標達成
    average: '#FFB300',   // 平均的
    poor: '#FF6F00',      // 改善必要
    critical: '#F44336',  // 緊急改善必要
  },
  // 廃棄物種類別の色
  waste: {
    concrete: '#795548',  // コンクリートガラ（茶）
    wood: '#8BC34A',      // 木くず（緑）
    metal: '#607D8B',     // 金属くず（グレー）
    plastic: '#03A9F4',   // プラスチック（水色）
    paper: '#FFC107',     // 紙くず（黄）
    mixed: '#9E9E9E',     // 混合廃棄物（グレー）
    glass: '#00BCD4',     // ガラス（シアン）
    other: '#E91E63',     // その他（ピンク）
  },
} as const;

// Tailwind CSS カスタムカラー設定用
export const tailwindColors = {
  primary: marumieColors.primary,
  success: marumieColors.success,
  warning: marumieColors.warning,
  danger: marumieColors.danger,
  gray: marumieColors.gray,
};

// KPI閾値設定
export const kpiThresholds = {
  finalDisposalRate: {
    excellent: 2.0,  // 2%以下
    good: 3.0,       // 3%以下
    average: 5.0,    // 5%以下
    poor: 7.0,       // 7%以下
  },
  recyclingRate: {
    excellent: 95.0, // 95%以上
    good: 90.0,      // 90%以上
    average: 85.0,   // 85%以上
    poor: 80.0,      // 80%以上
  },
  realRecyclingRate: {
    excellent: 95.0, // 95%以上
    good: 90.0,      // 90%以上
    average: 85.0,   // 85%以上
    poor: 80.0,      // 80%以上
  },
  sortingRate: {
    excellent: 95.0, // 95%以上
    good: 90.0,      // 90%以上
    average: 80.0,   // 80%以上
    poor: 70.0,      // 70%以上
  },
  wasteIntensity: {
    excellent: 40.0,  // 40t/億円以下
    good: 50.0,       // 50t/億円以下
    average: 60.0,    // 60t/億円以下
    poor: 70.0,       // 70t/億円以下
  },
};

// KPIの値に応じた色を返す関数
export function getKPIColor(value: number, kpiType: 'finalDisposalRate' | 'recyclingRate' | 'sortingRate'): string {
  const thresholds = kpiThresholds[kpiType];

  if (kpiType === 'finalDisposalRate') {
    // 最終処分率は低い方が良い
    if (value <= thresholds.excellent) return marumieColors.kpi.excellent;
    if (value <= thresholds.good) return marumieColors.kpi.good;
    if (value <= thresholds.average) return marumieColors.kpi.average;
    if (value <= thresholds.poor) return marumieColors.kpi.poor;
    return marumieColors.kpi.critical;
  } else {
    // 再資源化率・分別率は高い方が良い
    if (value >= thresholds.excellent) return marumieColors.kpi.excellent;
    if (value >= thresholds.good) return marumieColors.kpi.good;
    if (value >= thresholds.average) return marumieColors.kpi.average;
    if (value >= thresholds.poor) return marumieColors.kpi.poor;
    return marumieColors.kpi.critical;
  }
}

// Tailwind用のカラークラスを返す関数
export function getKPIColorClass(value: number, kpiType: 'finalDisposalRate' | 'recyclingRate' | 'sortingRate'): string {
  const thresholds = kpiThresholds[kpiType];

  if (kpiType === 'finalDisposalRate') {
    if (value <= thresholds.excellent) return 'text-green-500';
    if (value <= thresholds.good) return 'text-green-600';
    if (value <= thresholds.average) return 'text-yellow-600';
    if (value <= thresholds.poor) return 'text-orange-600';
    return 'text-red-600';
  } else {
    if (value >= thresholds.excellent) return 'text-green-500';
    if (value >= thresholds.good) return 'text-green-600';
    if (value >= thresholds.average) return 'text-yellow-600';
    if (value >= thresholds.poor) return 'text-orange-600';
    return 'text-red-600';
  }
}