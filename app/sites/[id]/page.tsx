import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSiteById, getBranchById } from '@/lib/data/csvLoader';
import { calculateSiteKPI } from '@/lib/kpi/calculator';
import { KPISummary } from '@/components/dashboard/KPISummary';
import { Card } from '@/components/ui/Card';
import { SiteDetailClient } from './SiteDetailClient';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface PageProps {
  params: Promise<{ id: string }>;
}

// 年度データのyearMonth（2024年度）
const YEAR_MONTH = '2024-04';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const site = getSiteById(id);

  return {
    title: site ? `${site.name} - 現場詳細` : '現場詳細',
  };
}

export default async function SiteDetailPage({ params }: PageProps) {
  const { id } = await params;

  // 現場データ取得
  const site = getSiteById(id);

  if (!site) {
    notFound();
  }

  // 支店情報取得
  const branch = getBranchById(site.branchId);

  // 当年度のKPI計算（2024年度）
  const siteKPI = await calculateSiteKPI(id, YEAR_MONTH);

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
            <Link href="/sites" className="hover:text-primary-600">
              現場一覧
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-800 font-medium">{site.name}</li>
        </ol>
      </nav>

      {/* 現場基本情報 */}
      <Card className="mb-8 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{site.name}</h1>
            <p className="text-sm text-gray-600">
              現場コード: <span className="font-mono">{site.code}</span>
            </p>
          </div>
          <div className="text-right">
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">所属支店</h3>
            <p className="text-lg font-semibold text-gray-900">
              {branch?.name || '不明'}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">工種</h3>
            <p className="text-lg font-semibold text-gray-900">{site.constructionType}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">施工高</h3>
            <p className="text-lg font-semibold text-gray-900">
              {site.constructionAmount ? `${site.constructionAmount.toFixed(1)}億円` : '未設定'}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">着工日</h3>
            <p className="text-lg font-semibold text-gray-900">
              {format(new Date(site.startDate), 'yyyy年MM月dd日', { locale: ja })}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">竣工予定日</h3>
            <p className="text-lg font-semibold text-gray-900">
              {site.endDate
                ? format(new Date(site.endDate), 'yyyy年MM月dd日', { locale: ja })
                : '未定'}
            </p>
          </div>
        </div>
      </Card>

      {/* KPIサマリー */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          KPI（2024年度）
        </h2>
        {siteKPI ? (
          <KPISummary kpi={siteKPI} />
        ) : (
          <Card className="p-6">
            <p className="text-gray-500 text-center">KPIデータがありません</p>
          </Card>
        )}
      </div>

      {/* サンキーダイアグラム */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">廃棄物フロー</h2>
        <SiteDetailClient siteId={id} />
      </div>
    </div>
  );
}
