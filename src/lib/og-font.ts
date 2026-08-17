import "server-only";

const FONT_FAMILY = "Black Han Sans";

/**
 * Fetches only the glyphs actually used in `text` from Google Fonts, as a
 * TrueType buffer Satori (the renderer behind `next/og`'s ImageResponse) can
 * embed. Without an explicit font covering them, Korean characters render as
 * blank boxes in generated OG images — this keeps playlist titles readable.
 *
 * Requests the CSS with an old-Chrome user agent because Google serves woff2
 * to modern browsers and ttf to legacy ones; Satori only reads ttf/otf/woff.
 */
export async function loadDisplayFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(FONT_FAMILY)}&text=${encodeURIComponent(text)}`;
    const cssResponse = await fetch(cssUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36",
      },
    });
    if (!cssResponse.ok) return null;

    const css = await cssResponse.text();
    const match = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/);
    if (!match) return null;

    const fontResponse = await fetch(match[1]);
    if (!fontResponse.ok) return null;

    return await fontResponse.arrayBuffer();
  } catch {
    return null;
  }
}
