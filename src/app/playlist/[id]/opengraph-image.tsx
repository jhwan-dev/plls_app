import { ImageResponse } from "next/og";
import { getPlaylistById } from "@/lib/playlists";
import { getPlaylistColors } from "@/lib/gradient";
import { loadDisplayFont } from "@/lib/og-font";

export const alt = "PLLS 플레이리스트";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BRAND_DARK = "#0f172a";
const BRAND_BLUE = "#3047FF";

// Freeform blob positions for the generated color field — mirrors the story
// card's "aura" composition (src/components/playlist/story-card.tsx), just
// at OG image proportions.
const BLOB_POSITIONS = [
  { top: -140, left: -100 },
  { top: -80, left: 700 },
  { top: 260, left: -120 },
  { top: 240, left: 820 },
];

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const playlist = await getPlaylistById(id);
  const title = playlist?.title ?? "PLLS";

  const fontData = await loadDisplayFont(`PLLS${title}`);
  const fontFamily = fontData ? "Black Han Sans" : undefined;
  const fonts = fontData
    ? [{ name: "Black Han Sans", data: fontData, style: "normal" as const, weight: 400 as const }]
    : undefined;

  // 3순위: 플레이리스트가 없거나(찾을 수 없음) 비어 있고 업로드된 커버도 없는 경우 — 고정 브랜드 이미지
  if (!playlist || (playlist.tracks.length === 0 && !playlist.coverImageUrl)) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: BRAND_DARK,
          }}
        >
          <div style={{ fontFamily, fontSize: 140, color: BRAND_BLUE, letterSpacing: 2 }}>PLLS</div>
        </div>
      ),
      { ...size, fonts },
    );
  }

  // 1순위: 유저가 업로드한 플레이리스트 커버
  if (playlist.coverImageUrl) {
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
            <div style={{ fontFamily, fontSize: 28, color: BRAND_BLUE, letterSpacing: 1 }}>PLLS</div>
            <div style={{ fontFamily, fontSize: 56, color: "#ffffff", maxWidth: 1040, lineHeight: 1.2 }}>{title}</div>
          </div>
        </div>
      ),
      { ...size, fonts },
    );
  }

  // 2순위(핵심): 상위 트랙들의 결정적 그라디언트 색상을 조합한 컬러 필드 + 제목 오버레이.
  // 실사진이 아니라 "이 플레이리스트만의 고유한 색 조합"이 미리보기에 뜬다.
  const colors = getPlaylistColors(
    playlist.tracks.map((track) => ({ title: track.title, artist: track.artist })),
    4,
  );

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          overflow: "hidden",
          backgroundColor: colors[0]!.solid,
        }}
      >
        {colors.map((color, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              width: 620,
              height: 620,
              top: BLOB_POSITIONS[index % BLOB_POSITIONS.length]!.top,
              left: BLOB_POSITIONS[index % BLOB_POSITIONS.length]!.left,
              borderRadius: 9999,
              backgroundImage: `radial-gradient(circle, ${color.from} 0%, transparent 70%)`,
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(15,23,42,0.6), rgba(15,23,42,0.05))",
          }}
        />
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: 64,
            gap: 12,
          }}
        >
          <div style={{ fontFamily, fontSize: 28, color: "#ffffff", opacity: 0.85, letterSpacing: 1 }}>PLLS</div>
          <div style={{ fontFamily, fontSize: 60, color: "#ffffff", maxWidth: 1040, lineHeight: 1.2 }}>{title}</div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
