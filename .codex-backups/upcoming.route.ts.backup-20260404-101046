import { fetchUpcomingEpisodes } from "@/server/scraper";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await fetchUpcomingEpisodes();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in upcoming episodes API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch upcoming episodes' },
      { status: 500 }
    );
  }
}
