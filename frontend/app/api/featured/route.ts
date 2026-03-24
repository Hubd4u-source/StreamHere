import { NextResponse } from "next/server";
import { getFeaturedAnime } from "@/server/featured";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const heroItems = await getFeaturedAnime();
    return NextResponse.json(heroItems);
  } catch (error) {
    console.error("Failed to fetch featured anime:", error);
    return NextResponse.json({ error: "Failed to fetch featured anime" }, { status: 500 });
  }
}
