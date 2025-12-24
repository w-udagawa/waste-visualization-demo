'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { marumieColors, kpiThresholds } from '@/lib/styles/colors';
import { cn } from '@/lib/utils';

export interface ComparisonDataPoint {
  name: string; // 支店名
  value: number; // KPI値
  branchId?: string;
}

export interface ComparisonChartProps {
  data: ComparisonDataPoint[];
  title?: string;
  kpiType: 'sortingRate' | 'realRecyclingRate' | 'finalDisposalRate' | 'wasteIntensity';
  targetValue?: number;
  height?: number;
  className?: string;
}

// KPI名の日本語ラベル
const kpiLabels: Record<string, string> = {
  sortingRate: '分別率',
  realRecyclingRate: '実質再資源化率',
  finalDisposalRate: '最終処分率',
  wasteIntensity: '原単位',
};

// KPI単位
const kpiUnits: Record<string, string> = {
  sortingRate: '%',
  realRecyclingRate: '%',
  finalDisposalRate: '%',
  wasteIntensity: 't/億円',
};

// カスタムツールチップ
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value?: number; payload?: { name: string } }>;
  unit: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  unit,
}) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0];

  return (
    <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
      <p className="font-semibold text-gray-800 mb-1">{data.payload?.name}</p>
      <p className="text-sm text-gray-600">
        値: <span className="font-semibold">{data.value?.toFixed(1)}{unit}</span>
      </p>
    </div>
  );
};

/**
 * 比較チャートコンポーネント
 * 支店別KPIを横棒グラフで比較表示
 */
export const ComparisonChart: React.FC<ComparisonChartProps> = ({
  data,
  title,
  kpiType,
  targetValue,
  height = 400,
  className,
}) => {
  const kpiLabel = kpiLabels[kpiType] || kpiType;
  const unit = kpiUnits[kpiType] || '';
  const defaultTitle = `${kpiLabel}支店別比較`;

  // KPI値に基づいて色を決定
  const getBarColor = (value: number): string => {
    const threshold = kpiThresholds[kpiType];
    if (!threshold) return marumieColors.primary[500];

    // 最終処分率は低い方が良い
    if (kpiType === 'finalDisposalRate') {
      if (value <= threshold.excellent) return marumieColors.kpi.excellent;
      if (value <= threshold.good) return marumieColors.kpi.good;
      if (value <= threshold.average) return marumieColors.kpi.average;
      if (value <= threshold.poor) return marumieColors.kpi.poor;
      return marumieColors.kpi.critical;
    }

    // その他のKPIは高い方が良い
    if (value >= threshold.excellent) return marumieColors.kpi.excellent;
    if (value >= threshold.good) return marumieColors.kpi.good;
    if (value >= threshold.average) return marumieColors.kpi.average;
    if (value >= threshold.poor) return marumieColors.kpi.poor;
    return marumieColors.kpi.critical;
  };

  return (
    <Card className={cn('p-6', className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title || defaultTitle}</h3>
        {targetValue && (
          <div className="text-sm text-gray-600">
            目標値: <span className="font-semibold">{targetValue.toFixed(1)}{unit}</span>
          </div>
        )}
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={marumieColors.gray[200]} />
          <XAxis
            type="number"
            stroke={marumieColors.gray[600]}
            label={{ value: unit, position: 'insideRight' }}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke={marumieColors.gray[600]}
            width={70}
          />
          <Tooltip content={<CustomTooltip unit={unit} />} />
          <Legend formatter={() => kpiLabel} />
          {targetValue && (
            <ReferenceLine
              x={targetValue}
              stroke={marumieColors.warning[500]}
              strokeDasharray="5 5"
              label={{ value: '目標', position: 'top' }}
            />
          )}
          <Bar dataKey="value" name={kpiLabel} radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.value)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
