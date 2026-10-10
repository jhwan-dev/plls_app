import { Skeleton } from "@/components/ui/skeleton";

/** Matches PlaylistListRow's geometry so loading states don't shift layout
 * once real rows arrive. */
export function PlaylistListRowSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3">
      <Skeleton className="size-11 shrink-0 rounded-[2px]" />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="h-3 w-12 shrink-0" />
    </div>
  );
}
