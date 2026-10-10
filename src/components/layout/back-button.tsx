"use client";

import { useRouter } from "next/navigation";

/** router.back() for screens (e.g. Playlist Detail) reached from many
 * different lists, where no single static href is "the" way back. */
export function BackButton({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <button type="button" onClick={() => router.back()} className="text-left">
      {children}
    </button>
  );
}
