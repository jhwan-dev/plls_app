import { Skeleton } from "@/components/ui/skeleton";

export function TrackRowSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3">
      <Skeleton className="size-11 shrink-0 rounded-[3px]" />
      <Skeleton className="size-8 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
      <Skeleton className="hidden h-3 w-24 shrink-0 sm:block" />
      <Skeleton className="h-3 w-8 shrink-0" />
    </div>
  );
}
