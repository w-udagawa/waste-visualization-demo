import React from 'react';
import { KPICard } from './KPICard';
import { cn } from '@/lib/utils';
import type { KPIResult } from '@/lib/kpi/formulas';

export interface KPISummaryProps {
  kpi: KPIResult & {
    wasteIntensity?: number;
  };
  previousKPI?: KPIResult & {
    wasteIntensity?: number;
  };
  className?: string;
}

// KPI目標値の定義
const KPI_TARGETS = {
  sortingRate: 90.0, // 90%
  realRecyclingRate: 85.0, // 85%
  finalDisposalRate: 3.0, // 3%
  wasteIntensity: 50.0, // 50t/億円
};

/**
 * KPIサマリーコンポーネント
 * 4つの主要KPIを並べて表示
 */
export const KPISummary: React.FC<KPISummaryProps> = ({
  kpi,
  previousKPI,
  className,
}) => {
  // トレンド計算
  const calculateTrend = (current: number, previous?: number) => {
    if (!previous) return undefined;

    const diff = current - previous;
    const percentage = previous !== 0 ? (diff / previous) * 100 : 0;

    return {
      value: diff,
      percentage,
      direction: diff > 0 ? ('up' as const) : diff < 0 ? ('down' as const) : ('flat' as const),
    };
  };

  const sortingRateTrend = calculateTrend(
    kpi.sortingRate,
    previousKPI?.sortingRate
  );
  const realRecyclingRateTrend = calculateTrend(
    kpi.realRecyclingRate,
    previousKPI?.realRecyclingRate
  );
  const finalDisposalRateTrend = calculateTrend(
    kpi.finalDisposalRate,
    previousKPI?.finalDisposalRate
  );
  const wasteIntensityTrend = kpi.wasteIntensity && previousKPI?.wasteIntensity
    ? calculateTrend(kpi.wasteIntensity, previousKPI.wasteIntensity)
    : undefined;

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6', className)}>
      <KPICard
        title="分別率"
        value={kpi.sortingRate}
        unit="%"
        trend={sortingRateTrend}
        target={KPI_TARGETS.sortingRate}
        kpiType="sortingRate"
      />
      <KPICard
        title="実質再資源化率"
        value={kpi.realRecyclingRate}
        unit="%"
        trend={realRecyclingRateTrend}
        target={KPI_TARGETS.realRecyclingRate}
        kpiType="realRecyclingRate"
      />
      <KPICard
        title="最終処分率"
        value={kpi.finalDisposalRate}
        unit="%"
        trend={finalDisposalRateTrend}
        target={KPI_TARGETS.finalDisposalRate}
        kpiType="finalDisposalRate"
      />
      {kpi.wasteIntensity !== undefined && (
        <KPICard
          title="原単位"
          value={kpi.wasteIntensity}
          unit="t/億円"
          trend={wasteIntensityTrend}
          target={KPI_TARGETS.wasteIntensity}
          kpiType="wasteIntensity"
        />
      )}
    </div>
  );
};
