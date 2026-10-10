import type { Metadata } from "next";
import { SearchView } from "@/components/search/search-view";
import { PlaylistDraftPanel } from "@/components/playlist/playlist-draft-panel";
import { Logo } from "@/components/brand/logo";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "검색/생성",
  description: "곡을 검색해서 나만의 PLLS를 만들어 보세요.",
};

export default async function SearchPage() {
  const session = await auth();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col">
      <header className="flex h-10 shrink-0 items-center border-b border-border px-3 md:hidden">
        <Logo iconSize={18} />
      </header>

      <div className="grid w-full flex-1 grid-cols-1 gap-8 px-3 py-6 lg:grid-cols-[1fr_380px] lg:gap-6 lg:px-4 lg:py-8">
        <SearchView />
        <div className="lg:sticky lg:top-8 lg:self-start">
          <PlaylistDraftPanel
            isAuthenticated={!!session?.user}
            isCurator={!!session?.user?.isCurator}
          />
        </div>
      </div>
    </div>
  );
}
