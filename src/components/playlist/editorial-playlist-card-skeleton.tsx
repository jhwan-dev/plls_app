import { Skeleton } from "@/components/ui/skeleton";

export function EditorialPlaylistCardSkeleton() {
  return (
    <div className="flex flex-col gap-2.5">
      <Skeleton className="aspect-[4/5] w-full rounded-[3px]" />
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}
