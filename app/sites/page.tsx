import { Metadata } from 'next';
import Link from 'next/link';
import { loadSites, loadBranches, getBranchById, loadWasteRecords } from '@/lib/data/csvLoader';
import { Card } from '@/components/ui/Card';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export const metadata: Metadata = {
  title: '現場一覧 - 廃棄物見える化システム',
  description: '建設現場一覧と基本情報',
};

// 年度データのyearMonth（2024年度）
const YEAR_MONTH = '2024-04';

export default async function SitesListPage() {
  // 全現場データ取得（支店情報含む）
  const sites = loadSites();
  const branches = loadBranches();
  const allRecords = loadWasteRecords();

  // サイトに支店情報と廃棄物量を追加
  const sitesWithBranch = sites
    .map((site) => {
      const branch = getBranchById(site.branchId);
      const siteRecords = allRecords.filter(
        r => r.siteCode === site.code && r.yearMonth === YEAR_MONTH
      );
      const totalWaste = siteRecords.reduce((sum, r) => sum + r.totalWeight, 0);
      return {
        ...site,
        branch: branch || { name: '不明', code: 'UNKNOWN' },
        totalWaste,
      };
    })
    .sort((a, b) => {
      // activeを先に、その後startDateの降順
      if (a.status === 'active' && b.status !== 'active') return -1;
      if (a.status !== 'active' && b.status === 'active') return 1;
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* ヘッダー */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">現場一覧</h1>
        <p className="text-gray-600">
          全{sites.length}件の現場が登録されています
        </p>
      </div>

      {/* 支店フィルタ */}
      <Card className="mb-6 p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">支店で絞り込み:</label>
          <div className="flex gap-2 flex-wrap">
            <button className="px-3 py-1 text-sm rounded-full bg-primary-500 text-white">
              全て
            </button>
            {branches.map((branch) => (
              <button
                key={branch.id}
                className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                {branch.name}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* 現場リスト */}
      <div className="grid grid-cols-1 gap-6">
        {sitesWithBranch.map((site) => (
          <Link key={site.id} href={`/sites/${site.id}`}>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold text-gray-900">
                      {site.name}
                    </h2>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        site.status === 'active'
                          ? 'bg-success-100 text-success-700'
                          : site.status === 'completed'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-warning-100 text-warning-700'
                      }`}
                    >
                      {site.status === 'active'
                        ? '稼働中'
                        : site.status === 'completed'
                        ? '完了'
                        : '一時停止'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    コード: <span className="font-mono">{site.code}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    所属支店: <span className="font-semibold">{site.branch.name}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">施工高</p>
                  <p className="text-lg font-bold text-gray-900">
                    {site.constructionAmount
                      ? `${site.constructionAmount.toFixed(1)}億円`
                      : '未設定'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-600 mb-1">工種</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {site.constructionType}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">着工日</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {format(new Date(site.startDate), 'yyyy/MM/dd', { locale: ja })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">竣工予定</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {site.endDate
                      ? format(new Date(site.endDate), 'yyyy/MM/dd', { locale: ja })
                      : '未定'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">総廃棄物量</p>
                  <p className="text-sm font-semibold text-gray-900">
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

      {sites.length === 0 && (
        <Card className="p-12">
          <div className="text-center text-gray-500">
            <p className="mb-2">現場が登録されていません</p>
            <p className="text-sm">データ登録画面から現場を追加してください</p>
          </div>
        </Card>
      )}
    </div>
  );
}
