import type { Metadata } from "next";
import { SearchView } from "@/components/search/search-view";
import { PlaylistDraftPanel } from "@/components/playlist/playlist-draft-panel";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "검색/생성",
  description: "곡을 검색해서 나만의 PLLS를 만들어 보세요.",
};

export default async function SearchPage() {
  const session = await auth();

  return (
    <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-[1fr_380px]">
      <SearchView />
      <div className="lg:sticky lg:top-8 lg:self-start">
        <PlaylistDraftPanel
          isAuthenticated={!!session?.user}
          isCurator={!!session?.user?.isCurator}
        />
      </div>
    </div>
  );
}
