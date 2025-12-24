/**
 * KPI Formula Definitions
 * 廃棄物管理KPIの計算式定義
 */

export interface WasteMetrics {
  totalWaste: number;
  sortedWaste: number;
  mixedWaste: number;
  recycledWaste: number;
  thermalRecycledWaste: number;
  finalDisposalWaste: number;
  constructionAmount?: number; // 施工高（億円）
}

export interface KPIResult {
  sortingRate: number;          // 分別率（%）
  realRecyclingRate: number;    // 実質再資源化率（%）
  finalDisposalRate: number;    // 最終処分率（%）
  wasteIntensity?: number;      // 原単位（t/億円）
}

/**
 * 分別率（%） = (分別済み総排出量 - 混合廃棄物) / 分別済み総排出量 × 100
 */
export function calculateSortingRate(totalWaste: number, mixedWaste: number): number {
  if (totalWaste === 0) return 0;
  return ((totalWaste - mixedWaste) / totalWaste) * 100;
}

/**
 * 実質再資源化率（%） = (再資源化量 + 熱回収量) / 総排出量 × 100
 */
export function calculateRealRecyclingRate(
  recycledWeight: number,
  thermalRecycledWeight: number,
  totalWeight: number
): number {
  if (totalWeight === 0) return 0;
  return ((recycledWeight + thermalRecycledWeight) / totalWeight) * 100;
}

/**
 * 最終処分率（%） = 最終処分量 / 総排出量 × 100
 */
export function calculateFinalDisposalRate(
  finalDisposalWeight: number,
  totalWeight: number
): number {
  if (totalWeight === 0) return 0;
  return (finalDisposalWeight / totalWeight) * 100;
}

/**
 * 原単位（t/億円） = 総排出量（t） / 施工高（億円）
 */
export function calculateWasteIntensity(
  totalWeight: number,
  constructionAmount: number
): number {
  if (constructionAmount === 0) return 0;
  // kgをtに変換
  const totalWeightInTons = totalWeight / 1000;
  return totalWeightInTons / constructionAmount;
}

/**
 * KPI総合計算
 */
export function calculateKPIs(metrics: WasteMetrics): KPIResult {
  const sortingRate = calculateSortingRate(metrics.totalWaste, metrics.mixedWaste);
  const realRecyclingRate = calculateRealRecyclingRate(
    metrics.recycledWaste,
    metrics.thermalRecycledWaste,
    metrics.totalWaste
  );
  const finalDisposalRate = calculateFinalDisposalRate(
    metrics.finalDisposalWaste,
    metrics.totalWaste
  );

  const result: KPIResult = {
    sortingRate,
    realRecyclingRate,
    finalDisposalRate,
  };

  if (metrics.constructionAmount && metrics.constructionAmount > 0) {
    result.wasteIntensity = calculateWasteIntensity(
      metrics.totalWaste,
      metrics.constructionAmount
    );
  }

  return result;
}

/**
 * 目標達成率（%）
 */
export function calculateAchievementRate(actualValue: number, targetValue: number): number {
  if (targetValue === 0) return 0;
  return (actualValue / targetValue) * 100;
}

/**
 * 月次トレンド計算（前月比）
 */
export function calculateMonthlyTrend(currentValue: number, previousValue: number): {
  value: number;
  percentage: number;
  direction: 'up' | 'down' | 'flat';
} {
  const diff = currentValue - previousValue;
  const percentage = previousValue !== 0 ? (diff / previousValue) * 100 : 0;

  return {
    value: diff,
    percentage,
    direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'flat',
  };
}