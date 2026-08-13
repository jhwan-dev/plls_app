"use client";

import { forwardRef, useEffect, useState } from "react";

interface StoryCardTrack {
  title: string;
  artist: string;
}

interface StoryCardProps {
  title: string;
  /** Up to 4 cover URLs — same source as the playlist's collage thumbnail. */
  coverUrls: string[];
  /** Up to 4 tracks, shown as a numbered list. */
  tracks: StoryCardTrack[];
}

type WordmarkTone = "blue" | "white" | "black";

const WORDMARK_SRC: Record<WordmarkTone, string> = {
  blue: "/brand/plls-wordmark.png",
  white: "/brand/plls-wordmark-white.png",
  black: "/brand/plls-wordmark-black.png",
};

// Cobalt's own perceptual luminance (~85/255) — the reference point for
// deciding whether it'll actually stand out against the card background.
const COBALT_LUMINANCE = 85;

function sampleTone(coverImg: HTMLImageElement): WordmarkTone {
  const canvas = document.createElement("canvas");
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "white";
  ctx.drawImage(coverImg, 0, 0, 16, 16);

  let sum = 0;
  const { data } = ctx.getImageData(0, 0, 16, 16);
  for (let i = 0; i < data.length; i += 4) {
    sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }
  const rawLuminance = sum / (data.length / 4);

  // Approximates the CSS treatment: brightness(0.55), then blended with the
  // gradient overlay's ~55% opaque near-black at the card's top.
  const afterBrightness = rawLuminance * 0.55;
  const finalLuminance = afterBrightness * (1 - 0.55) + 15 * 0.55;

  if (Math.abs(finalLuminance - COBALT_LUMINANCE) > 60) return "blue";
  return finalLuminance < 128 ? "white" : "black";
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Samples the background exactly as it's actually composited behind the
 * wordmark (source cover → blur(80px) brightness(0.55) → the dark gradient
 * overlay, evaluated near the top of the card where the logo sits), picks
 * whichever wordmark tone will actually read against it — the brand blue by
 * default, falling back to white/black only where blue's contrast is too
 * low — and returns it pre-baked as a data: URI. html-to-image's own
 * image-fetching step has proven unreliable for this asset in practice
 * (loaded, correctly sized, still rasterized blank); handing it an
 * already-self-contained data URI leaves nothing for that step to do.
 */
function useWordmarkDataUrl(coverUrl: string | undefined): string | null {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function resolve() {
      let tone: WordmarkTone = "white";
      if (coverUrl) {
        try {
          const coverImg = await loadImage(coverUrl);
          tone = sampleTone(coverImg);
        } catch {
          tone = "white";
        }
      }
      if (cancelled) return;

      try {
        const wordmarkImg = await loadImage(WORDMARK_SRC[tone]);
        if (cancelled) return;
        const canvas = document.createElement("canvas");
        canvas.width = wordmarkImg.naturalWidth;
        canvas.height = wordmarkImg.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(wordmarkImg, 0, 0);
        if (!cancelled) setDataUrl(canvas.toDataURL("image/png"));
      } catch {
        // Leave dataUrl null — no wordmark rather than a broken image icon.
      }
    }

    resolve();
    return () => {
      cancelled = true;
    };
  }, [coverUrl]);

  return dataUrl;
}

// Rendered off-screen at a fixed 1080x1920 (Instagram Story's 9:16) and
// rasterized via html-to-image — see instagram-story-share-button.tsx. Sized
// with inline pixel styles rather than Tailwind classes so the captured
// image doesn't depend on the viewport it happens to be mounted in.
export const StoryCard = forwardRef<HTMLDivElement, StoryCardProps>(function StoryCard(
  { title, coverUrls, tracks },
  ref,
) {
  const covers = coverUrls.slice(0, 4);
  const topTracks = tracks.slice(0, 4);
  const wordmarkDataUrl = useWordmarkDataUrl(covers[0]);

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        width: 1080,
        height: 1920,
        overflow: "hidden",
        backgroundColor: "#0f172a",
        fontFamily: "var(--font-geist-sans), Arial, sans-serif",
        color: "#ffffff",
      }}
    >
      {covers[0] && (
        // eslint-disable-next-line @next/next/no-img-element -- captured via html-to-image, not next/image
        <img
          src={covers[0]}
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
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(15,23,42,0.55), rgba(15,23,42,0.92))",
        }}
      />

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
        {wordmarkDataUrl && (
          // eslint-disable-next-line @next/next/no-img-element -- captured via html-to-image, not next/image
          <img src={wordmarkDataUrl} alt="PLLS" style={{ width: 320, height: 102 }} />
        )}

        <div
          style={{
            width: 720,
            height: 720,
            display: "grid",
            gridTemplateColumns: covers.length > 1 ? "1fr 1fr" : "1fr",
            gridTemplateRows: covers.length > 2 ? "1fr 1fr" : "1fr",
            gap: 6,
            borderRadius: 32,
            overflow: "hidden",
            boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
            backgroundColor: "#1e293b",
          }}
        >
          {covers.map((url, index) => (
            // eslint-disable-next-line @next/next/no-img-element -- captured via html-to-image, not next/image
            <img
              key={index}
              src={url}
              crossOrigin="anonymous"
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ))}
        </div>

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
                <span style={{ fontSize: 32, fontWeight: 700, color: "#3047FF", width: 48, flexShrink: 0 }}>
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
                      color: "rgba(255,255,255,0.6)",
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
