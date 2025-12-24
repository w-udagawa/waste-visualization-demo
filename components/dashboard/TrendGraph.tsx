'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { marumieColors } from '@/lib/styles/colors';
import { cn } from '@/lib/utils';

export interface TrendDataPoint {
  yearMonth: string;
  sortingRate?: number;
  realRecyclingRate?: number;
  finalDisposalRate?: number;
  wasteIntensity?: number;
}

export interface TrendGraphProps {
  data: TrendDataPoint[];
  title?: string;
  kpiKeys?: Array<'sortingRate' | 'realRecyclingRate' | 'finalDisposalRate' | 'wasteIntensity'>;
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

// KPI毎の色設定
const kpiColors: Record<string, string> = {
  sortingRate: marumieColors.primary[500],
  realRecyclingRate: marumieColors.success[500],
  finalDisposalRate: marumieColors.danger[500],
  wasteIntensity: marumieColors.warning[500],
};

// カスタムツールチップ
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string; dataKey?: string }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
      <p className="font-semibold text-gray-800 mb-2">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-600">{entry.name}:</span>
          <span className="font-semibold" style={{ color: entry.color }}>
            {entry.value?.toFixed(1)}
            {entry.dataKey === 'wasteIntensity' ? 't/億円' : '%'}
          </span>
        </div>
      ))}
    </div>
  );
};

/**
 * トレンドグラフコンポーネント
 * Rechartsを使用して過去数ヶ月のKPI推移を可視化
 */
export const TrendGraph: React.FC<TrendGraphProps> = ({
  data,
  title = 'KPI推移（過去6ヶ月）',
  kpiKeys = ['sortingRate', 'realRecyclingRate', 'finalDisposalRate'],
  height = 400,
  className,
}) => {
  // 年月を短縮形式に変換（2024-11 → 11月）
  const formatXAxis = (value: string): string => {
    const [, month] = value.split('-');
    return `${parseInt(month, 10)}月`;
  };

  return (
    <Card className={cn('p-6', className)}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={marumieColors.gray[200]} />
          <XAxis
            dataKey="yearMonth"
            tickFormatter={formatXAxis}
            stroke={marumieColors.gray[600]}
          />
          <YAxis
            stroke={marumieColors.gray[600]}
            label={{ value: '(%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => kpiLabels[value] || value}
            wrapperStyle={{ paddingTop: '20px' }}
          />
          {kpiKeys.map((key) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              name={kpiLabels[key]}
              stroke={kpiColors[key]}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
