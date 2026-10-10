/** The cover editor's fixed 24-color palette — neutrals + the brand blue +
 * a curated spread of hues at two values each, so a hand-drawn cover reads
 * as deliberately-limited pixel art, not a random RGB picker. Chosen
 * directly from the two-canvas comparison artifact the user picked 32×32 /
 * 24 colors from — keep in sync if that ever changes. */
export const PIXEL_PALETTE: readonly string[] = [
  "#262521", "#58514A", "#9D978A", "#D7D3C6", "#F3F1E9", "#FFFFFF",
  "#3047FF", "#8CA0FF", "#1C2B4A", "#6E4FC9", "#C9B6F2", "#C9527A",
  "#F2B6C9", "#E8465A", "#E8742F", "#8A4B2E", "#F5A623", "#C9A227",
  "#F7C56B", "#2F8F6B", "#9CD9B6", "#6FB3A8", "#2F6F8F", "#6FD1E0",
];

export const PIXEL_COVER_GRID = 32;
