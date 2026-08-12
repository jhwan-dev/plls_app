import { EditorialPlaylistCardSkeleton } from "@/components/playlist/editorial-playlist-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function DiscoverLoading() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-14 px-4 pt-10 pb-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-10 w-40" />
      </div>

      {Array.from({ length: 4 }).map((_, sectionIndex) => (
        <div key={sectionIndex} className="flex flex-col gap-5">
          <Skeleton className="h-8 w-32" />
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-40 shrink-0 sm:w-48">
                <EditorialPlaylistCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
