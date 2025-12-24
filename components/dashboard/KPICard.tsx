import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { marumieColors, kpiThresholds } from '@/lib/styles/colors';

export interface KPICardProps {
  title: string;
  value: number;
  unit: string;
  trend?: {
    value: number;
    percentage: number;
    direction: 'up' | 'down' | 'flat';
  };
  target?: number;
  kpiType?: 'sortingRate' | 'realRecyclingRate' | 'finalDisposalRate' | 'wasteIntensity';
  className?: string;
}

/**
 * KPIカードコンポーネント
 * 単一のKPI値を表示し、前月比トレンドと目標達成状況を可視化
 */
export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  unit,
  trend,
  target,
  kpiType,
  className,
}) => {
  // KPI値に基づいて色を決定
  const getKPIColor = (): string => {
    if (!kpiType) return marumieColors.gray[500];

    const threshold = kpiThresholds[kpiType];
    if (!threshold) return marumieColors.gray[500];

    // 最終処分率と原単位は低い方が良い
    if (kpiType === 'finalDisposalRate' || kpiType === 'wasteIntensity') {
      if (value <= threshold.excellent) return marumieColors.kpi.excellent;
      if (value <= threshold.good) return marumieColors.kpi.good;
      if (value <= threshold.average) return marumieColors.kpi.average;
      if (value <= threshold.poor) return marumieColors.kpi.poor;
      return marumieColors.kpi.critical;
    }

    // その他のKPI（分別率、再資源化率）は高い方が良い
    if (value >= threshold.excellent) return marumieColors.kpi.excellent;
    if (value >= threshold.good) return marumieColors.kpi.good;
    if (value >= threshold.average) return marumieColors.kpi.average;
    if (value >= threshold.poor) return marumieColors.kpi.poor;
    return marumieColors.kpi.critical;
  };

  // トレンドアイコンと色を決定
  const getTrendIcon = (): string => {
    if (!trend) return '';
    if (trend.direction === 'up') return '↑';
    if (trend.direction === 'down') return '↓';
    return '→';
  };

  const getTrendColor = (): string => {
    if (!trend || !kpiType) return marumieColors.gray[500];

    // 最終処分率と原単位は下がる方が良い
    if (kpiType === 'finalDisposalRate' || kpiType === 'wasteIntensity') {
      if (trend.direction === 'down') return marumieColors.success[500];
      if (trend.direction === 'up') return marumieColors.danger[500];
      return marumieColors.gray[500];
    }

    // その他のKPI（分別率、再資源化率）は上がる方が良い
    if (trend.direction === 'up') return marumieColors.success[500];
    if (trend.direction === 'down') return marumieColors.danger[500];
    return marumieColors.gray[500];
  };

  // 目標達成率を計算
  const achievementRate = target ? (value / target) * 100 : null;

  const kpiColor = getKPIColor();

  return (
    <Card className={cn('p-6 hover:shadow-lg transition-shadow', className)}>
      <div className="space-y-4">
        {/* ヘッダー */}
        <div className="flex items-start justify-between">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          {target && (
            <Badge
              variant={achievementRate && achievementRate >= 100 ? 'success' : 'warning'}
              size="sm"
            >
              目標: {target.toFixed(1)}{unit}
            </Badge>
          )}
        </div>

        {/* メインKPI値 */}
        <div className="flex items-baseline gap-2">
          <span
            className="text-4xl font-bold"
            style={{ color: kpiColor }}
          >
            {value.toFixed(1)}
          </span>
          <span className="text-xl text-gray-500">{unit}</span>
        </div>

        {/* トレンドと目標達成率 */}
        <div className="flex items-center justify-between text-sm">
          {/* 前月比 */}
          {trend && (
            <div className="flex items-center gap-1">
              <span
                className="font-semibold"
                style={{ color: getTrendColor() }}
              >
                {getTrendIcon()} {Math.abs(trend.percentage).toFixed(1)}%
              </span>
              <span className="text-gray-500">前月比</span>
            </div>
          )}

          {/* 目標達成率 */}
          {achievementRate !== null && (
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  'font-semibold',
                  achievementRate >= 100 ? 'text-green-600' : 'text-orange-600'
                )}
              >
                {achievementRate.toFixed(0)}%
              </span>
              <span className="text-gray-500">達成</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
