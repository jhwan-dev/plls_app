import { PlaylistListRowSkeleton } from "@/components/playlist/playlist-list-row-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function CuratorZoneLoading() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-10 px-4 pt-10 pb-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-48" />
      </div>
      {Array.from({ length: 3 }).map((_, section) => (
        <div key={section} className="flex flex-col">
          <Skeleton className="mb-3 h-5 w-32" />
          <div className="flex flex-col divide-y divide-border border-t border-border">
            {Array.from({ length: 2 }).map((_, i) => (
              <PlaylistListRowSkeleton key={i} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
