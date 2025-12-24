import { NextRequest, NextResponse } from 'next/server';
import { calculateKPITrend } from '@/lib/kpi/calculator';

/**
 * GET /api/kpi/trend?type=company&targetId=xxx&months=6
 * KPIトレンドデータを取得（過去N ヶ月分）
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'company';
    const targetId = searchParams.get('targetId');
    const monthsParam = searchParams.get('months');
    const months = monthsParam ? parseInt(monthsParam, 10) : 6;

    // typeのバリデーション
    if (type !== 'site' && type !== 'branch' && type !== 'company') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid type parameter',
          message: 'Type must be one of: site, branch, company',
        },
        { status: 400 }
      );
    }

    // site/branchの場合はtargetIdが必須
    if ((type === 'site' || type === 'branch') && !targetId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing targetId parameter',
          message: 'targetId is required for site and branch types',
        },
        { status: 400 }
      );
    }

    // トレンドデータ計算
    const trendData = await calculateKPITrend(
      type as 'site' | 'branch' | 'company',
      targetId,
      months
    );

    return NextResponse.json({
      success: true,
      data: trendData,
    });
  } catch (error) {
    console.error('Error fetching KPI trend:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch KPI trend',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
