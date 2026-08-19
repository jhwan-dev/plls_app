import { forwardRef } from "react";

interface StoryCardTrack {
  title: string;
  artist: string;
}

interface StoryCardProps {
  title: string;
  /** User-uploaded playlist cover — when set, used as both the blurred
   * background and a sharp foreground image. When absent, the card falls
   * back to the PLLS "P" brand mark on white (see BrandMark's doc comment
   * for this explicit default-thumbnail exception). */
  coverImageUrl?: string | null;
  /** Up to 4 tracks, shown as a numbered list. */
  tracks: StoryCardTrack[];
}

const WORDMARK_COLOR = "#3047FF";

// Rendered off-screen at a fixed 1080x1920 (Instagram Story's 9:16) and
// rasterized via html-to-image — see instagram-story-share-button.tsx. Sized
// with inline pixel styles rather than Tailwind classes so the captured
// image doesn't depend on the viewport it happens to be mounted in.
export const StoryCard = forwardRef<HTMLDivElement, StoryCardProps>(function StoryCard(
  { title, coverImageUrl, tracks },
  ref,
) {
  const topTracks = tracks.slice(0, 4);
  const textColor = coverImageUrl ? "#ffffff" : "#111111";
  const subTextColor = coverImageUrl ? "rgba(255,255,255,0.6)" : "rgba(17,17,17,0.55)";

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        width: 1080,
        height: 1920,
        overflow: "hidden",
        backgroundColor: coverImageUrl ? "#0f172a" : "#ffffff",
        fontFamily: "var(--font-geist-sans), Arial, sans-serif",
        color: textColor,
        // text-align is inherited — the button that mounts this off-screen
        // card lives inside the visible page's "text-center sm:text-left"
        // header block, so pin it so this card never depends on whatever
        // happens to be above it in the page.
        textAlign: "left",
      }}
    >
      {coverImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element -- captured via html-to-image, not next/image
        <img
          src={coverImageUrl}
          crossOrigin="anonymous"
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(80px) brightness(0.55)",
            transform: "scale(1.3)",
          }}
        />
      )}

      {coverImageUrl && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(15,23,42,0.35), rgba(15,23,42,0.88))",
          }}
        />
      )}

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          height: "100%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 64,
          padding: "0 96px",
        }}
      >
        {coverImageUrl ? (
          <div
            style={{
              fontFamily: "var(--font-display), Arial, sans-serif",
              fontSize: 80,
              lineHeight: 1,
              letterSpacing: 1,
              color: WORDMARK_COLOR,
            }}
          >
            PLLS
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- captured via html-to-image, not next/image
          <img src="/brand/p-symbol.png" alt="PLLS" style={{ height: 200, width: "auto" }} />
        )}

        {coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element -- captured via html-to-image, not next/image
          <img
            src={coverImageUrl}
            crossOrigin="anonymous"
            alt=""
            style={{
              width: 720,
              height: 720,
              objectFit: "cover",
              borderRadius: 32,
              boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
            }}
          />
        )}

        <h1
          style={{
            fontSize: 60,
            fontWeight: 800,
            textAlign: "center",
            lineHeight: 1.25,
            maxWidth: 880,
            margin: 0,
          }}
        >
          {title}
        </h1>

        {topTracks.length > 0 && (
          <div style={{ width: 880, display: "flex", flexDirection: "column", gap: 24 }}>
            {topTracks.map((track, index) => (
              <div key={index} style={{ display: "flex", alignItems: "center", gap: 24 }}>
                <span style={{ fontSize: 32, fontWeight: 700, color: WORDMARK_COLOR, width: 48, flexShrink: 0 }}>
                  {index + 1}
                </span>
                <div style={{ display: "flex", flexDirection: "column", minWidth: 0, gap: 4 }}>
                  <span
                    style={{
                      fontSize: 32,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {track.title}
                  </span>
                  <span
                    style={{
                      fontSize: 24,
                      color: subTextColor,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {track.artist}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});
