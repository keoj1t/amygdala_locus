import { NextRequest, NextResponse } from 'next/server';
import { getUniversityReviews } from '@/lib/services/reddit-scraper';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const universityName = searchParams.get('name') || searchParams.get('universityName') || '';

    if (!universityName.trim()) {
      return NextResponse.json({ reviews: [], source: 'None', isAI: false }, { status: 200 });
    }

    const result = await getUniversityReviews(universityName, 5);

    return NextResponse.json({
      reviews: result.data,
      source: result.source,
      isAI: result.isAI,
    }, { status: 200 });
  } catch (error) {
    console.error('[API /api/university/reviews] Error:', error);
    // Always return safe 200 response with empty reviews array on failure
    return NextResponse.json({ reviews: [], source: 'Error', isAI: false }, { status: 200 });
  }
}
