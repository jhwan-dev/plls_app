import { NextRequest, NextResponse } from "next/server";
import { ItunesApiError, searchItunesTracks } from "@/lib/itunes";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter `q` is required." },
      { status: 400 },
    );
  }

  const limit = Number(searchParams.get("limit") ?? 25);

  try {
    const tracks = await searchItunesTracks(query, {
      limit: Number.isFinite(limit) ? Math.min(limit, 50) : 25,
    });

    return NextResponse.json(
      { tracks },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
    );
  } catch (error) {
    if (error instanceof ItunesApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Unexpected error while searching iTunes:", error);
    return NextResponse.json(
      { error: "Failed to search iTunes. Please try again later." },
      { status: 500 },
    );
  }
}
