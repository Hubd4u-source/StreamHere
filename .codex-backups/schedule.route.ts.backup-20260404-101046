import { NextResponse } from 'next/server';
import { fetchRegionalSchedule } from '@/server/scraper';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    const schedule = await fetchRegionalSchedule();
    return NextResponse.json(schedule);
  } catch (error) {
    console.error('API Error (Schedule):', error);
    return NextResponse.json({ error: 'Failed to fetch schedule' }, { status: 500 });
  }
}
