import { Metadata } from 'next';
import Link from 'next/link';
import { loadBranches, loadSites, loadWasteRecords } from '@/lib/data/csvLoader';
import { calculateBranchKPI } from '@/lib/kpi/calculator';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: '部門一覧 - 廃棄物見える化システム',
  description: '部門別廃棄物管理KPI一覧',
};

// 年度データのyearMonth（2024年度）
const YEAR_MONTH = '2024-04';

export default async function BranchesListPage() {
  // 部門データ取得（全社を除外）
  const allBranches = loadBranches();
  const branches = allBranches.filter(b => b.code !== 'DEPT000');

  // サイトデータ取得
  const allSites = loadSites();
  const allRecords = loadWasteRecords();

  // 各部門のKPIを計算
  const branchesWithKPI = await Promise.all(
    branches.map(async (branch) => {
      const kpi = await calculateBranchKPI(branch.id, YEAR_MONTH);

      // この部門のサイト一覧
      const branchSites = allSites.filter(s => s.branchId === branch.id && s.status === 'active');
      const siteCodes = branchSites.map(s => s.code);

      // 総廃棄物量を計算
      const totalWaste = allRecords
        .filter(r => siteCodes.includes(r.siteCode) && r.yearMonth === YEAR_MONTH)
        .reduce((sum, r) => sum + r.totalWeight, 0);

      return {
        ...branch,
        kpi,
        totalWaste,
        siteCount: branchSites.length,
      };
    })
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* ヘッダー */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">部門一覧</h1>
        <p className="text-gray-600">
          2024年度廃棄物データ（解体・改修除く） | {branches.length}部門
        </p>
      </div>

      {/* 部門リスト */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {branchesWithKPI.map((branch) => (
          <Link key={branch.id} href={`/branches/${branch.id}`}>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {branch.name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    コード: <span className="font-mono">{branch.code}</span>
                  </p>
                </div>
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                  {branch.siteCount}現場
                </span>
              </div>

              {branch.kpi ? (
                <div className="space-y-4">
                  {/* KPIサマリー */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">最終処分率</p>
                      <p
                        className={`text-lg font-bold ${
                          branch.kpi.finalDisposalRate <= 3.0
                            ? 'text-success-600'
                            : branch.kpi.finalDisposalRate <= 5.0
                            ? 'text-warning-600'
                            : 'text-danger-600'
                        }`}
                      >
                        {branch.kpi.finalDisposalRate.toFixed(1)}%
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">実質再資源化率</p>
                      <p
                        className={`text-lg font-bold ${
                          branch.kpi.realRecyclingRate >= 90.0
                            ? 'text-success-600'
                            : branch.kpi.realRecyclingRate >= 85.0
                            ? 'text-warning-600'
                            : 'text-danger-600'
                        }`}
                      >
                        {branch.kpi.realRecyclingRate.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {/* 廃棄物量 */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">総排出量</p>
                        <p className="font-semibold text-gray-900">
                          {(branch.kpi.totalWaste / 1000).toFixed(1)}t
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">再資源化量</p>
                        <p className="font-semibold text-success-600">
                          {(branch.kpi.recycledWaste / 1000).toFixed(1)}t
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">最終処分量</p>
                        <p className="font-semibold text-danger-600">
                          {(branch.kpi.finalDisposalWaste / 1000).toFixed(1)}t
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  KPIデータがありません
                </div>
              )}

              {/* 詳細リンク */}
              <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                <span className="text-primary-600 font-medium text-sm">
                  詳細を見る →
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {branches.length === 0 && (
        <Card className="p-12">
          <div className="text-center text-gray-500">
            <p className="mb-2">部門が登録されていません</p>
            <p className="text-sm">データ登録画面から部門を追加してください</p>
          </div>
        </Card>
      )}
    </div>
  );
}
