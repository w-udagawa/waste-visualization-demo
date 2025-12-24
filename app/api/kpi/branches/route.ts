import { NextRequest, NextResponse } from 'next/server';
import { calculateAllBranchKPIs } from '@/lib/kpi/calculator';

/**
 * GET /api/kpi/branches?yearMonth=YYYY-MM
 * 全支店のKPIを取得（支店別比較用）
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const yearMonth = searchParams.get('yearMonth');

    // yearMonthが指定されていない場合は2024-04を使用（デモデータ用）
    const targetYearMonth = yearMonth || '2024-04';

    // 全支店のKPIを計算（CSVから取得）
    const branchKPIs = await calculateAllBranchKPIs(targetYearMonth);

    return NextResponse.json({
      success: true,
      data: branchKPIs,
    });
  } catch (error) {
    console.error('Error fetching branches KPI:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch branches KPI',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
