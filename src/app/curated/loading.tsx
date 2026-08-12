import { EditorialPlaylistCardSkeleton } from "@/components/playlist/editorial-playlist-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function CuratedLoading() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 pt-10 pb-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-48" />
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <EditorialPlaylistCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
