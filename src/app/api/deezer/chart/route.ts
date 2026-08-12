import { NextRequest, NextResponse } from "next/server";
import { DeezerApiError, getDeezerChartTracks } from "@/lib/deezer";

export async function GET(request: NextRequest) {
  const limit = Number(request.nextUrl.searchParams.get("limit") ?? 30);

  try {
    const result = await getDeezerChartTracks(Number.isFinite(limit) ? Math.min(limit, 50) : 30);

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    if (error instanceof DeezerApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Unexpected error while fetching Deezer chart:", error);
    return NextResponse.json(
      { error: "차트를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 },
    );
  }
}
