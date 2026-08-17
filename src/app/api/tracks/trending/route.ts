import { NextRequest, NextResponse } from "next/server";
import { getTrendingTracks } from "@/lib/trending";

export async function GET(request: NextRequest) {
  const limit = Number(request.nextUrl.searchParams.get("limit") ?? 20);

  try {
    const tracks = await getTrendingTracks(Number.isFinite(limit) ? Math.min(limit, 50) : 20);
    return NextResponse.json(
      { tracks },
      { headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300" } },
    );
  } catch (error) {
    console.error("Unexpected error while fetching trending tracks:", error);
    return NextResponse.json(
      { error: "인기 트랙을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 },
    );
  }
}
