import { TrackRowSkeleton } from "@/components/playlist/track-row-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function PlaylistLoading() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-10 px-4 pt-10 pb-8">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
        <Skeleton className="aspect-[4/5] w-full max-w-[280px] shrink-0 rounded-[3px] sm:w-64" />
        <div className="flex flex-1 flex-col items-center gap-4 sm:items-start">
          <div className="flex w-full flex-col items-center gap-2 sm:items-start">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full max-w-xs" />
          </div>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16 rounded-lg" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </div>
      </div>

      <div className="flex flex-col border-t border-border">
        {Array.from({ length: 5 }).map((_, i) => (
          <TrackRowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
