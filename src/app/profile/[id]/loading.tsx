import { PlaylistListRowSkeleton } from "@/components/playlist/playlist-list-row-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-12 px-4 pt-10 pb-8">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="size-24 shrink-0 rounded-[3px] sm:size-28" />
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-5 w-56" />
        <Skeleton className="h-9 w-24" />
      </div>

      <div className="flex flex-col">
        <Skeleton className="mb-3 h-5 w-28" />
        <div className="flex flex-col divide-y divide-border">
          {Array.from({ length: 4 }).map((_, i) => (
            <PlaylistListRowSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
