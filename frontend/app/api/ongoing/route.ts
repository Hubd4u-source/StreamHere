import { fetchOngoingSeries } from "@/server/scraper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page') || 1);
    const query = searchParams.get('q') || '';
    
    const data = await fetchOngoingSeries(page, query);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in ongoing series API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ongoing series' },
      { status: 500 }
    );
  }
}
