import { NextRequest, NextResponse } from "next/server";
import { DeezerApiError, searchDeezerTracks } from "@/lib/deezer";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter `q` is required." },
      { status: 400 },
    );
  }

  const index = Number(searchParams.get("index") ?? 0);
  const limit = Number(searchParams.get("limit") ?? 25);

  try {
    const result = await searchDeezerTracks(query, {
      index: Number.isFinite(index) ? index : 0,
      limit: Number.isFinite(limit) ? Math.min(limit, 50) : 25,
    });

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    if (error instanceof DeezerApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Unexpected error while searching Deezer:", error);
    return NextResponse.json(
      { error: "Failed to search Deezer. Please try again later." },
      { status: 500 },
    );
  }
}
