import { PlaylistListRowSkeleton } from "@/components/playlist/playlist-list-row-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function DiscoverLoading() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-10 px-4 pt-10 pb-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-10 w-40" />
      </div>

      {Array.from({ length: 4 }).map((_, sectionIndex) => (
        <div key={sectionIndex} className="flex flex-col">
          <Skeleton className="mb-3 h-5 w-32" />
          <div className="flex flex-col divide-y divide-border">
            {Array.from({ length: 3 }).map((_, i) => (
              <PlaylistListRowSkeleton key={i} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
