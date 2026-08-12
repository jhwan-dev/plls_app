import { EditorialPlaylistCardSkeleton } from "@/components/playlist/editorial-playlist-card-skeleton";
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

      <div className="flex flex-col gap-5">
        <Skeleton className="h-8 w-28" />
        <div className="grid grid-cols-2 gap-x-4 gap-y-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <EditorialPlaylistCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
