import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getPlaylistById } from "@/lib/playlists";
import { loadDisplayFont } from "@/lib/og-font";

export const alt = "PLLS 플레이리스트";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Intrinsic ratio of public/brand/p-symbol.png (see BrandMark) — read once
// as a base64 data URI since Satori (next/og's renderer) can't resolve a
// relative /brand/... path.
const P_SYMBOL_RATIO = 780 / 623;
const pSymbolData = await readFile(join(process.cwd(), "public", "brand", "p-symbol.png"), "base64");
const P_SYMBOL_SRC = `data:image/png;base64,${pSymbolData}`;

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const playlist = await getPlaylistById(id);
  const title = playlist?.title ?? null;

  const fontData = await loadDisplayFont(`PLLS${title ?? ""}`);
  const fontFamily = fontData ? "Black Han Sans" : undefined;
  const fonts = fontData
    ? [{ name: "Black Han Sans", data: fontData, style: "normal" as const, weight: 400 as const }]
    : undefined;

  // 1순위: 유저가 업로드한 플레이리스트 커버
  if (playlist?.coverImageUrl) {
    return new ImageResponse(
      (
        <div style={{ position: "relative", width: "100%", height: "100%", display: "flex" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- rendered by Satori (next/og), not next/image */}
          <img
            src={playlist.coverImageUrl}
            alt=""
            width={size.width}
            height={size.height}
            style={{ objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: 64,
              gap: 12,
              background: "linear-gradient(to top, rgba(15,23,42,0.85), rgba(15,23,42,0.05))",
            }}
          >
            <div style={{ fontFamily, fontSize: 28, color: "#3047FF", letterSpacing: 1 }}>PLLS</div>
            <div style={{ fontFamily, fontSize: 56, color: "#ffffff", maxWidth: 1040, lineHeight: 1.2 }}>{title}</div>
          </div>
        </div>
      ),
      { ...size, fonts },
    );
  }

  // 2순위(기본): 커버를 올리지 않은 플레이리스트, 또는 존재하지 않는 플레이리스트 모두
  // PLLS의 P 심볼을 기본 썸네일로 사용 — 플레이리스트 제목이 있으면 그 아래 함께 표시.
  const pSymbolHeight = 220;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          backgroundColor: "#ffffff",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- rendered by Satori (next/og), not next/image */}
        <img
          src={P_SYMBOL_SRC}
          alt=""
          width={Math.round(pSymbolHeight / P_SYMBOL_RATIO)}
          height={pSymbolHeight}
          style={{ objectFit: "contain" }}
        />
        {title && (
          <div
            style={{
              fontFamily,
              fontSize: 48,
              color: "#111111",
              maxWidth: 900,
              textAlign: "center",
              lineHeight: 1.3,
            }}
          >
            {title}
          </div>
        )}
      </div>
    ),
    { ...size, fonts },
  );
}
