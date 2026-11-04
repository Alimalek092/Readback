import { NextRequest, NextResponse } from 'next/server';
import { searchOpenLibrary } from '@/lib/open-library';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') || '';

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  const results = await searchOpenLibrary(query);
  return NextResponse.json({ results });
}
