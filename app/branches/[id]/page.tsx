import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBranchById, loadSites, loadWasteRecords } from '@/lib/data/csvLoader';
import { calculateBranchKPI } from '@/lib/kpi/calculator';
import { KPISummary } from '@/components/dashboard/KPISummary';
import { Card } from '@/components/ui/Card';
import { BranchDetailClient } from './BranchDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

// 年度データのyearMonth（2024年度）
const YEAR_MONTH = '2024-04';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const branch = getBranchById(id);

  return {
    title: branch ? `${branch.name} - 部門詳細` : '部門詳細',
  };
}

export default async function BranchDetailPage({ params }: PageProps) {
  const { id } = await params;

  // 部門データ取得
  const branch = getBranchById(id);

  if (!branch) {
    notFound();
  }

  // 全社ブランチの場合はリダイレクト
  if (branch.code === 'DEPT000') {
    notFound();
  }

  // 配下のサイト一覧
  const allSites = loadSites();
  const branchSites = allSites.filter(s => s.branchId === id && s.status === 'active');

  // 廃棄物記録を取得して各サイトの総量を計算
  const allRecords = loadWasteRecords();
  const sitesWithWaste = branchSites.map(site => {
    const siteRecords = allRecords.filter(
      r => r.siteCode === site.code && r.yearMonth === YEAR_MONTH
    );
    const totalWaste = siteRecords.reduce((sum, r) => sum + r.totalWeight, 0);
    return { ...site, totalWaste };
  });

  // 部門KPI計算
  const branchKPI = await calculateBranchKPI(id, YEAR_MONTH);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* パンくずリスト */}
      <nav className="mb-6 text-sm text-gray-600">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-primary-600">
              ホーム
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/branches" className="hover:text-primary-600">
              部門一覧
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-800 font-medium">{branch.name}</li>
        </ol>
      </nav>

      {/* 部門基本情報 */}
      <Card className="mb-8 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{branch.name}</h1>
            <p className="text-sm text-gray-600">
              部門コード: <span className="font-mono">{branch.code}</span>
            </p>
          </div>
          <div className="text-right">
            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-700">
              {branchSites.length}現場
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">地域</h3>
            <p className="text-lg font-semibold text-gray-900">{branch.region}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">対象期間</h3>
            <p className="text-lg font-semibold text-gray-900">2024年度（解体・改修除く）</p>
          </div>
        </div>
      </Card>

      {/* KPIサマリー */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          KPI（2024年度）
        </h2>
        {branchKPI ? (
          <KPISummary kpi={branchKPI} />
        ) : (
          <Card className="p-6">
            <p className="text-gray-500 text-center">KPIデータがありません</p>
          </Card>
        )}
      </div>

      {/* サンキーダイアグラム */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">廃棄物フロー</h2>
        <BranchDetailClient branchId={id} branchName={branch.name} />
      </div>

      {/* 部門内の現場一覧 */}
      {sitesWithWaste.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            所属現場（{sitesWithWaste.length}件）
          </h2>
          <div className="space-y-4">
            {sitesWithWaste.map((site) => (
              <Link key={site.id} href={`/sites/${site.id}`}>
                <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{site.name}</h3>
                      <p className="text-sm text-gray-600">
                        コード: <span className="font-mono">{site.code}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">総廃棄物量</p>
                      <p className="font-semibold text-gray-900">
                        {site.totalWaste > 0
                          ? `${(site.totalWaste / 1000).toFixed(1)}t`
                          : 'データなし'}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
