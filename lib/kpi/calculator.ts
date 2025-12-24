import { calculateKPIs, type WasteMetrics, type KPIResult } from './formulas';
import {
  loadBranches,
  loadSites,
  loadWasteRecords,
  getSiteByCode,
  getSiteById,
  getBranchById,
  type WasteRecord,
} from '@/lib/data/csvLoader';

export interface SiteKPI extends KPIResult {
  siteId: string;
  siteCode: string;
  siteName: string;
  branchName: string;
  yearMonth: string;
  totalWaste: number;
  sortedWaste: number;
  mixedWaste: number;
  recycledWaste: number;
  thermalRecycledWaste: number;
  finalDisposalWaste: number;
  constructionAmount?: number;
}

export interface BranchKPI extends KPIResult {
  branchId: string;
  branchCode: string;
  branchName: string;
  yearMonth: string;
  totalWaste: number;
  sortedWaste: number;
  mixedWaste: number;
  recycledWaste: number;
  thermalRecycledWaste: number;
  finalDisposalWaste: number;
  siteCount: number;
  constructionAmount?: number;
}

export interface CompanyKPI extends KPIResult {
  yearMonth: string;
  totalWaste: number;
  sortedWaste: number;
  mixedWaste: number;
  recycledWaste: number;
  thermalRecycledWaste: number;
  finalDisposalWaste: number;
  branchCount: number;
  siteCount: number;
  constructionAmount?: number;
}

/**
 * 廃棄物記録を集計してWasteMetricsを返す
 */
function aggregateRecords(records: WasteRecord[], constructionAmount?: number): WasteMetrics {
  return records.reduce(
    (acc, record) => ({
      totalWaste: acc.totalWaste + record.totalWeight,
      sortedWaste: acc.sortedWaste + record.sortedWeight,
      mixedWaste: acc.mixedWaste + record.mixedWeight,
      recycledWaste: acc.recycledWaste + record.recycledWeight,
      thermalRecycledWaste: acc.thermalRecycledWaste + record.thermalRecycledWeight,
      finalDisposalWaste: acc.finalDisposalWaste + record.finalDisposalWeight,
      constructionAmount,
    }),
    {
      totalWaste: 0,
      sortedWaste: 0,
      mixedWaste: 0,
      recycledWaste: 0,
      thermalRecycledWaste: 0,
      finalDisposalWaste: 0,
      constructionAmount,
    }
  );
}

/**
 * 現場単位のKPI計算
 */
export async function calculateSiteKPI(
  siteId: string,
  yearMonth: string
): Promise<SiteKPI | null> {
  // 現場情報を取得
  const site = getSiteById(siteId);
  if (!site) {
    return null;
  }

  // 部門情報を取得
  const branch = getBranchById(site.branchId);
  if (!branch) {
    return null;
  }

  // 廃棄物記録を取得
  const allRecords = loadWasteRecords();
  const records = allRecords.filter(
    r => r.siteCode === site.code && r.yearMonth === yearMonth
  );

  // 集計
  const metrics = aggregateRecords(records, site.constructionAmount || undefined);

  // KPI計算
  const kpis = calculateKPIs(metrics);

  return {
    siteId: site.id,
    siteCode: site.code,
    siteName: site.name,
    branchName: branch.name,
    yearMonth,
    ...metrics,
    ...kpis,
  };
}

/**
 * 現場コードでKPI計算
 */
export async function calculateSiteKPIByCode(
  siteCode: string,
  yearMonth: string
): Promise<SiteKPI | null> {
  const site = getSiteByCode(siteCode);
  if (!site) {
    return null;
  }
  return calculateSiteKPI(site.id, yearMonth);
}

/**
 * 支店単位のKPI計算
 */
export async function calculateBranchKPI(
  branchId: string,
  yearMonth: string
): Promise<BranchKPI | null> {
  // 支店情報を取得
  const branch = getBranchById(branchId);
  if (!branch) {
    return null;
  }

  // 配下の現場を取得
  const allSites = loadSites();
  const branchSites = allSites.filter(s => s.branchId === branchId && s.status === 'active');
  const siteCodes = branchSites.map(s => s.code);

  // 廃棄物記録を取得
  const allRecords = loadWasteRecords();
  const records = allRecords.filter(
    r => siteCodes.includes(r.siteCode) && r.yearMonth === yearMonth
  );

  // 施工高の合計
  const totalConstructionAmount = branchSites.reduce(
    (sum, site) => sum + (site.constructionAmount || 0),
    0
  );

  // 集計
  const metrics = aggregateRecords(
    records,
    totalConstructionAmount > 0 ? totalConstructionAmount : undefined
  );

  // KPI計算
  const kpis = calculateKPIs(metrics);

  return {
    branchId: branch.id,
    branchCode: branch.code,
    branchName: branch.name,
    yearMonth,
    ...metrics,
    ...kpis,
    siteCount: branchSites.length,
  };
}

/**
 * 全社単位のKPI計算
 */
export async function calculateCompanyKPI(yearMonth: string): Promise<CompanyKPI> {
  // 全社サイト（SITE_COMPANY）のデータを使用
  const allRecords = loadWasteRecords();
  const records = allRecords.filter(
    r => r.siteCode === 'SITE_COMPANY' && r.yearMonth === yearMonth
  );

  const branches = loadBranches();
  const sites = loadSites().filter(s => s.status === 'active');

  // 施工高の合計
  const totalConstructionAmount = sites.reduce(
    (sum, site) => sum + (site.constructionAmount || 0),
    0
  );

  // 集計
  const metrics = aggregateRecords(
    records,
    totalConstructionAmount > 0 ? totalConstructionAmount : undefined
  );

  // KPI計算
  const kpis = calculateKPIs(metrics);

  return {
    yearMonth,
    ...metrics,
    ...kpis,
    branchCount: branches.length,
    siteCount: sites.length,
  };
}

/**
 * 複数月のKPIを計算（トレンド分析用）
 */
export async function calculateKPITrend(
  targetType: 'site' | 'branch' | 'company',
  targetId: string | null,
  months: number = 6
): Promise<(SiteKPI | BranchKPI | CompanyKPI)[]> {
  // 利用可能な年月を取得
  const allRecords = loadWasteRecords();
  const availableYearMonths = [...new Set(allRecords.map(r => r.yearMonth))].sort();

  const results: (SiteKPI | BranchKPI | CompanyKPI)[] = [];

  // 最新のデータから過去months分を取得
  const targetYearMonths = availableYearMonths.slice(-months);

  for (const yearMonth of targetYearMonths) {
    let kpi;
    if (targetType === 'site' && targetId) {
      kpi = await calculateSiteKPI(targetId, yearMonth);
    } else if (targetType === 'branch' && targetId) {
      kpi = await calculateBranchKPI(targetId, yearMonth);
    } else if (targetType === 'company') {
      kpi = await calculateCompanyKPI(yearMonth);
    }

    if (kpi) {
      results.push(kpi);
    }
  }

  return results;
}

/**
 * 全支店のKPIを取得（比較用）
 */
export async function calculateAllBranchKPIs(yearMonth: string): Promise<BranchKPI[]> {
  const branches = loadBranches();
  const results: BranchKPI[] = [];

  for (const branch of branches) {
    // 全社ブランチはスキップ
    if (branch.code === 'DEPT000') continue;

    const kpi = await calculateBranchKPI(branch.id, yearMonth);
    if (kpi && kpi.totalWaste > 0) {
      results.push(kpi);
    }
  }

  return results;
}
