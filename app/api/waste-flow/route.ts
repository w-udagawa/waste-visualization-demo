import { NextRequest, NextResponse } from 'next/server';
import {
  loadWasteRecords,
  getSiteById,
  loadSites,
} from '@/lib/data/csvLoader';
import { transformToSankeyData, WasteFlowData, SankeyData } from '@/lib/kpi/sankeyTransform';

/**
 * GET /api/waste-flow
 *
 * クエリパラメータ:
 * - siteId: 現場ID（オプション、指定しない場合は全社）
 * - siteCode: 現場コード（オプション、siteIdの代わりに使用可能）
 * - branchId: 支店ID（オプション）
 * - yearMonth: 対象年月（YYYY-MM形式、オプション、デフォルトは2024-04）
 *
 * 返却値:
 * - SankeyData 形式の JSON
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    let siteCode = searchParams.get('siteCode');
    const siteId = searchParams.get('siteId');
    const branchId = searchParams.get('branchId');
    const yearMonth = searchParams.get('yearMonth') || '2024-04';

    // siteIdが指定されている場合、siteCodeに変換
    if (siteId && !siteCode) {
      const site = getSiteById(siteId);
      if (site) {
        siteCode = site.code;
      }
    }

    // 廃棄物データ取得
    const allRecords = loadWasteRecords();

    // フィルタリング
    let filteredRecords = allRecords.filter(r => r.yearMonth === yearMonth);

    if (siteCode) {
      // 特定の現場
      filteredRecords = filteredRecords.filter(r => r.siteCode === siteCode);
    } else if (branchId) {
      // 特定の支店配下の現場
      const sites = loadSites();
      const branchSiteCodes = sites
        .filter(s => s.branchId === branchId)
        .map(s => s.code);
      filteredRecords = filteredRecords.filter(r => branchSiteCodes.includes(r.siteCode));
    } else {
      // デフォルト: 全社データ（SITE_COMPANY）
      filteredRecords = filteredRecords.filter(r => r.siteCode === 'SITE_COMPANY');
    }

    // データが空の場合
    if (filteredRecords.length === 0) {
      return NextResponse.json({
        nodes: [],
        links: [],
        message: '指定された条件でデータが見つかりませんでした',
      });
    }

    // 廃棄物種類ごとに集計
    const wasteFlowMap = new Map<string, WasteFlowData>();

    filteredRecords.forEach((record) => {
      const existing = wasteFlowMap.get(record.wasteType);

      if (existing) {
        existing.totalWeight += record.totalWeight;
        existing.recycledWeight += record.recycledWeight;
        existing.thermalRecycledWeight += record.thermalRecycledWeight;
        existing.finalDisposalWeight += record.finalDisposalWeight;
      } else {
        wasteFlowMap.set(record.wasteType, {
          wasteType: record.wasteType,
          totalWeight: record.totalWeight,
          recycledWeight: record.recycledWeight,
          thermalRecycledWeight: record.thermalRecycledWeight,
          finalDisposalWeight: record.finalDisposalWeight,
        });
      }
    });

    // Map を配列に変換（総量の降順でソート）
    const wasteFlowData = Array.from(wasteFlowMap.values()).sort(
      (a, b) => b.totalWeight - a.totalWeight
    );

    // Sankeyデータに変換
    const sankeyData: SankeyData = transformToSankeyData(wasteFlowData);

    return NextResponse.json(sankeyData);
  } catch (error) {
    console.error('Waste flow API error:', error);
    return NextResponse.json(
      { error: '廃棄物フローデータの取得に失敗しました' },
      { status: 500 }
    );
  }
}
