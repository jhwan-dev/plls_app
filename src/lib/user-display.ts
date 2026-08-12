/** Nickname takes priority once set; falls back to the raw Google name, then "익명". */
export function displayName(user: { name?: string | null; nickname?: string | null }): string {
  return user.nickname ?? user.name ?? "익명";
}
