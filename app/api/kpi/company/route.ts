import { NextRequest, NextResponse } from 'next/server';
import { calculateCompanyKPI } from '@/lib/kpi/calculator';

/**
 * GET /api/kpi/company?yearMonth=YYYY-MM
 * 全社単位のKPIを取得
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const yearMonth = searchParams.get('yearMonth') || '2024-04';

    const kpi = await calculateCompanyKPI(yearMonth);

    return NextResponse.json({
      success: true,
      data: kpi,
    });
  } catch (error) {
    console.error('Error fetching company KPI:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch company KPI',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
