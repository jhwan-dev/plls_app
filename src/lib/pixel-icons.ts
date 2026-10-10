/** Hand-authored bitmap icons — fixed, deterministic (not generated like
 * cover art). Each row string is one pixel row, "1" = filled. */
export interface PixelIconDef {
  color: string;
  rows: string[];
}

export const PIXEL_ICONS: Record<string, PixelIconDef> = {
  "p-icon": {
    color: "#3047FF",
    rows: ["1111100", "1111110", "1100111", "1100111", "1100111", "1111110", "1111100", "1100000", "1100000", "1100000", "1100000"],
  },
  "nav-playlists": {
    color: "currentColor",
    rows: ["1111111", "1111111", "0000000", "1111100", "1111100", "0000000", "1111111", "1111111"],
  },
  "nav-crown": {
    color: "currentColor",
    rows: ["1000101", "1101111", "1111111", "1111111", "0111110", "0111110", "1111111"],
  },
  "nav-search": {
    color: "currentColor",
    rows: ["0011100", "0100010", "1000001", "1000001", "1000001", "0100010", "0011010", "0000101"],
  },
  "nav-profile": {
    color: "currentColor",
    rows: ["0011100", "0111110", "0111110", "0111110", "0011100", "1111111", "1111111", "1111111"],
  },
  "icon-heart": {
    color: "#E8465A",
    rows: ["0110110", "1111111", "1111111", "0111110", "0011100", "0001000"],
  },
  "icon-share": {
    color: "#716C60",
    rows: ["0001100", "0011110", "0101100", "0001100", "0001100", "1111111", "1000001", "1000001", "1111111"],
  },
  "icon-repost": {
    color: "#716C60",
    rows: ["011111110", "000000010", "000000010", "000000111", "010000010", "111000000", "010000000", "010000000", "011111110"],
  },
  "icon-play": {
    color: "#3047FF",
    rows: ["1000000", "1100000", "1110000", "1111000", "1111100", "1111000", "1110000", "1100000", "1000000"],
  },
  "icon-search": {
    color: "#9D978A",
    rows: ["0011100", "0100010", "1000001", "1000001", "1000001", "0100010", "0011010", "0000101"],
  },
  "icon-plus": {
    color: "#3047FF",
    rows: ["0001000", "0001000", "0001000", "1111111", "0001000", "0001000", "0001000"],
  },
  "icon-close": {
    color: "#9D978A",
    rows: ["1000001", "0100010", "0010100", "0001000", "0010100", "0100010", "1000001"],
  },
  "icon-check": {
    color: "#3047FF",
    rows: ["0000001", "0000011", "0000110", "1001100", "0111000", "0010000"],
  },
  brush: {
    color: "#262521",
    rows: ["0000111", "0001110", "0011100", "0111000", "1110000", "1101000", "1100100", "1100010"],
  },
};

export type PixelIconName = keyof typeof PIXEL_ICONS;

/** `colorOverride` lets a state-driven icon (liked heart, reposted loop)
 * repaint without a new bitmap def — the shape stays fixed, only the fill
 * color changes between an "on" and "off" state. */
export function drawPixelIcon(
  canvas: HTMLCanvasElement,
  name: string,
  resolvedColor?: string,
  colorOverride?: string,
): void {
  const def = PIXEL_ICONS[name];
  if (!def) return;
  const rows = def.rows;
  const cols = rows[0]!.length;
  const cell = Math.max(1, Math.floor(Math.min(canvas.width / cols, canvas.height / rows.length)));
  const w = cols * cell;
  const h = rows.length * cell;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = colorOverride ?? (def.color === "currentColor" ? (resolvedColor ?? "#262521") : def.color);
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < cols; x++) {
      if (rows[y]![x] === "1") ctx.fillRect(x * cell, y * cell, cell, cell);
    }
  }
}
