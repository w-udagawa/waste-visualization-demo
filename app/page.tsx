'use client';

import React, { useEffect, useState } from 'react';
import { KPISummary } from '@/components/dashboard/KPISummary';
import { ComparisonChart, ComparisonDataPoint } from '@/components/dashboard/ComparisonChart';
import { WasteFlowSankey } from '@/components/dashboard/WasteFlowSankey';
import type { CompanyKPI, BranchKPI } from '@/lib/kpi/calculator';
import type { SankeyData } from '@/lib/kpi/sankeyTransform';

// 年度データのyearMonth（2024年度）
const YEAR_MONTH = '2024-04';
// 全社現場コード（Sankey図で使用）
const COMPANY_SITE_CODE = 'SITE_COMPANY';

/**
 * 全社ダッシュボードページ
 * 2024年度廃棄物データを表示
 */
export default function DashboardPage() {
  const [currentKPI, setCurrentKPI] = useState<CompanyKPI | null>(null);
  const [branchesKPI, setBranchesKPI] = useState<BranchKPI[]>([]);
  const [sankeyData, setSankeyData] = useState<SankeyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // データ取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [currentResponse, branchesResponse, sankeyResponse] =
          await Promise.all([
            fetch(`/api/kpi/company?yearMonth=${YEAR_MONTH}`),
            fetch(`/api/kpi/branches?yearMonth=${YEAR_MONTH}`),
            fetch(`/api/waste-flow?yearMonth=${YEAR_MONTH}&siteCode=${COMPANY_SITE_CODE}`),
          ]);

        // レスポンスのチェック
        if (!currentResponse.ok) {
          throw new Error('Failed to fetch current KPI');
        }
        if (!branchesResponse.ok) {
          throw new Error('Failed to fetch branches KPI');
        }

        const currentData = await currentResponse.json();
        const branchesData = await branchesResponse.json();
        const sankeyDataResponse = sankeyResponse.ok
          ? await sankeyResponse.json()
          : null;

        // データの設定
        setCurrentKPI(currentData.data);
        setBranchesKPI(branchesData.data);
        setSankeyData(sankeyDataResponse);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 部門別比較データの変換（最終処分率）- 「全社」を除外
  const branchComparisonData: ComparisonDataPoint[] = branchesKPI
    .filter((branch) => branch.branchName !== '全社')
    .map((branch) => ({
      name: branch.branchName,
      value: branch.finalDisposalRate,
      branchId: branch.branchId,
    }));

  // ローディング表示
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">データを読み込んでいます...</p>
        </div>
      </div>
    );
  }

  // エラー表示
  if (error || !currentKPI) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 font-semibold mb-2">エラーが発生しました</h2>
          <p className="text-red-600">{error || 'データが見つかりません'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ページヘッダー */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          全社廃棄物管理ダッシュボード
        </h1>
        <p className="text-gray-600">
          2024年度（解体・改修除く） | {currentKPI.branchCount}部門
        </p>
      </div>

      {/* KPIサマリー（前月比なし） */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">主要KPI</h2>
        <KPISummary kpi={currentKPI} />
      </section>

      {/* サンキーダイアグラム */}
      {sankeyData && sankeyData.nodes.length > 0 && (
        <section>
          <WasteFlowSankey
            data={sankeyData}
            title="全社廃棄物フロー（2024年度）"
            height={600}
          />
        </section>
      )}

      {/* 部門別比較 */}
      {branchComparisonData.length > 0 && (
        <section>
          <ComparisonChart
            data={branchComparisonData}
            kpiType="finalDisposalRate"
            targetValue={3.0}
            height={300}
          />
        </section>
      )}

      {/* フッター情報 */}
      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
        <p>
          <strong>総排出量:</strong> {(currentKPI.totalWaste / 1000).toFixed(1)}t |{' '}
          <strong>再資源化量:</strong> {(currentKPI.recycledWaste / 1000).toFixed(1)}t |{' '}
          <strong>最終処分量:</strong> {((currentKPI.totalWaste - currentKPI.recycledWaste - (currentKPI.thermalRecycledWaste || 0)) / 1000).toFixed(1)}t
        </p>
      </div>
    </div>
  );
}
