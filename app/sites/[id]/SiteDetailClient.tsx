'use client';

import { useState, useEffect } from 'react';
import { WasteFlowSankey } from '@/components/dashboard/WasteFlowSankey';
import { SankeyData } from '@/lib/kpi/sankeyTransform';
import { format } from 'date-fns';

interface SiteDetailClientProps {
  siteId: string;
}

export function SiteDetailClient({ siteId }: SiteDetailClientProps) {
  const [sankeyData, setSankeyData] = useState<SankeyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 現在の年月を取得
  const currentYearMonth = format(new Date(), 'yyyy-MM');

  useEffect(() => {
    async function fetchWasteFlow() {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/waste-flow?siteId=${siteId}&yearMonth=${currentYearMonth}`
        );

        if (!response.ok) {
          throw new Error('データの取得に失敗しました');
        }

        const data = await response.json();
        setSankeyData(data);
      } catch (err) {
        console.error('Waste flow fetch error:', err);
        setError(err instanceof Error ? err.message : '不明なエラー');
      } finally {
        setLoading(false);
      }
    }

    fetchWasteFlow();
  }, [siteId, currentYearMonth]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-white rounded-lg border border-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4" />
          <p className="text-gray-600">廃棄物フローを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-white rounded-lg border border-red-200">
        <div className="text-center">
          <p className="text-red-600 mb-2">エラーが発生しました</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!sankeyData || sankeyData.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500">表示するデータがありません</p>
      </div>
    );
  }

  return (
    <WasteFlowSankey
      data={sankeyData}
      title={`廃棄物フロー（${currentYearMonth}）`}
      height={600}
    />
  );
}
