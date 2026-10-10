/**
 * Deterministic pixel-art generator — every playlist cover and avatar
 * without a user-uploaded image renders one of these instead of a gradient
 * or a letter initial. Same seed always produces the same art, everywhere
 * it appears (a repost shows the identical swatch as the original).
 *
 * Left half is generated, right half mirrored — makes the result read as
 * "drawn" rather than noise. See PLLS Redesign's pixel-art direction.
 */

function hashString(seed: string): number {
  let hash = 5381;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 33) ^ seed.charCodeAt(i);
  }
  return hash >>> 0;
}

// Small, deterministic PRNG (mulberry32) seeded from the hash — Math.random
// can't be seeded, so a generic hash-derived RNG keeps the output stable
// across renders/devices instead of only "looking similar."
function mulberry32(seed: number): () => number {
  let state = seed | 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A handful of limited, harmonious palettes rather than full RGB — reads as
// deliberately-limited pixel art, not random noise. Each includes a near-
// black for definition against the light screen background.
const PALETTES: readonly (readonly string[])[] = [
  ["#3047FF", "#8CA0FF", "#E8465A", "#262521"],
  ["#2F8F6B", "#9CD9B6", "#F5A623", "#262521"],
  ["#C9527A", "#F2B6C9", "#3047FF", "#262521"],
  ["#E8742F", "#F7C56B", "#2F6F8F", "#262521"],
  ["#6E4FC9", "#C9B6F2", "#E8465A", "#262521"],
];

const BG = "#F3F1E9";

export interface PixelArtOptions {
  grid?: number;
  fillChance?: number;
}

/** Returns a flat grid×grid array of CSS colors (BG where a cell is empty) — render it however the caller needs (canvas, DOM grid, SVG). */
export function generatePixelGrid(seed: string, { grid = 16, fillChance = 0.5 }: PixelArtOptions = {}): string[][] {
  const rand = mulberry32(hashString(seed));
  const palette = PALETTES[Math.floor(rand() * PALETTES.length)]!;
  const half = Math.ceil(grid / 2);
  const cells: string[][] = Array.from({ length: grid }, () => Array(grid).fill(BG));

  for (let y = 0; y < grid; y++) {
    for (let x = 0; x < half; x++) {
      const fill = rand() < fillChance ? palette[Math.floor(rand() * palette.length)]! : BG;
      cells[y]![x] = fill;
      cells[y]![grid - 1 - x] = fill;
    }
  }

  return cells;
}

export function drawPixelArt(
  canvas: HTMLCanvasElement,
  seed: string,
  cellSize: number,
  options?: PixelArtOptions,
): void {
  const grid = options?.grid ?? 16;
  const cells = generatePixelGrid(seed, options);
  canvas.width = grid * cellSize;
  canvas.height = grid * cellSize;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < grid; y++) {
    for (let x = 0; x < grid; x++) {
      const color = cells[y]![x]!;
      if (color !== BG) {
        ctx.fillStyle = color;
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }
}
