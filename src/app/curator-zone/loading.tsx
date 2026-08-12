import { EditorialPlaylistCardSkeleton } from "@/components/playlist/editorial-playlist-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function CuratorZoneLoading() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-14 px-4 pt-10 pb-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-48" />
      </div>
      {Array.from({ length: 3 }).map((_, section) => (
        <div key={section} className="flex flex-col gap-4">
          <Skeleton className="h-8 w-32" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-8">
            {Array.from({ length: 2 }).map((_, i) => (
              <EditorialPlaylistCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
