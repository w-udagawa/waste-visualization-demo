'use client';

import React from 'react';
import {
  Sankey,
  Tooltip,
  ResponsiveContainer,
  Layer,
  Rectangle,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { formatWeight, formatPercentage, SankeyData } from '@/lib/kpi/sankeyTransform';
import { marumieColors } from '@/lib/styles/colors';

export interface WasteFlowSankeyProps {
  data: SankeyData;
  title?: string;
  height?: number;
  className?: string;
}

// カスタムノードコンポーネント
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomNode = (props: any) => {
  const { x, y, width, height, index, payload, containerWidth } = props;

  const isLeft = x < containerWidth / 2;
  const textAnchor = isLeft ? 'end' : 'start';
  const textX = isLeft ? x - 6 : x + width + 6;

  return (
    <Layer key={`CustomNode${index}`}>
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill={payload.color || marumieColors.primary[500]}
        fillOpacity="0.9"
      />
      <text
        x={textX}
        y={y + height / 2}
        textAnchor={textAnchor}
        dominantBaseline="middle"
        className="text-sm font-medium fill-gray-700"
      >
        {payload.name}
      </text>
      <text
        x={textX}
        y={y + height / 2 + 16}
        textAnchor={textAnchor}
        dominantBaseline="middle"
        className="text-xs fill-gray-500"
      >
        {formatWeight(payload.value)}
      </text>
    </Layer>
  );
};

// カスタムリンクコンポーネント
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomLink = (props: any) => {
  const { sourceX, targetX, sourceY, targetY, sourceControlX, targetControlX, linkWidth, index } = props;

  return (
    <Layer key={`CustomLink${index}`}>
      <path
        d={`
          M${sourceX},${sourceY}
          C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}
        `}
        stroke={marumieColors.primary[300]}
        strokeWidth={linkWidth}
        strokeOpacity={0.4}
        fill="none"
        className="transition-all duration-200 hover:stroke-opacity-70"
      />
    </Layer>
  );
};

// カスタムツールチップ
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload?: { name?: string; value?: number; source?: { name: string; value: number }; target?: { name: string } } }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  if (!data) return null;

  // ノードの場合
  if (data.name) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800 mb-1">{data.name}</p>
        <p className="text-sm text-gray-600">
          総量: <span className="font-semibold">{formatWeight(data.value ?? 0)}</span>
        </p>
      </div>
    );
  }

  // リンクの場合
  if (data.source && data.target) {
    const percentage = formatPercentage(data.value ?? 0, data.source.value);
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800 mb-2">
          {data.source.name} → {data.target.name}
        </p>
        <p className="text-sm text-gray-600">
          流量: <span className="font-semibold">{formatWeight(data.value ?? 0)}</span>
        </p>
        <p className="text-sm text-gray-600">
          割合: <span className="font-semibold">{percentage}</span>
        </p>
      </div>
    );
  }

  return null;
};

/**
 * 廃棄物フローサンキーダイアグラムコンポーネント
 * 総廃棄物量から廃棄物種類、処理方法への流れを可視化
 */
export const WasteFlowSankey: React.FC<WasteFlowSankeyProps> = ({
  data,
  title = '廃棄物フロー（総量 → 種類 → 処理方法）',
  height = 600,
  className,
}) => {
  // データが空の場合
  if (!data.nodes.length || !data.links.length) {
    return (
      <Card className={cn('p-6', className)}>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">表示するデータがありません</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn('p-6', className)}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>

      {/* 凡例 */}
      <div className="flex items-center gap-6 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: marumieColors.success[500] }}
          />
          <span className="text-gray-600">再資源化</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: marumieColors.danger[500] }}
          />
          <span className="text-gray-600">最終処分</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <Sankey
          data={data}
          node={<CustomNode />}
          link={<CustomLink />}
          nodePadding={30}
          nodeWidth={20}
          linkCurvature={0.5}
          iterations={64}
          margin={{ top: 20, right: 180, bottom: 20, left: 180 }}
        >
          <Tooltip content={<CustomTooltip />} />
        </Sankey>
      </ResponsiveContainer>

      {/* 説明テキスト */}
      <div className="mt-4 text-xs text-gray-500">
        <p>
          総廃棄物量から各廃棄物種類への分岐、さらに再資源化と最終処分への流れを可視化しています。
          線の太さは廃棄物の量を表しています。
        </p>
      </div>
    </Card>
  );
};
