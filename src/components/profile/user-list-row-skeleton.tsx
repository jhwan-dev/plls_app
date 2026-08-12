import { Skeleton } from "@/components/ui/skeleton";

export function UserListRowSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      <Skeleton className="size-8 shrink-0 rounded-full" />
      <Skeleton className="h-4 w-1/3 flex-1" />
      <Skeleton className="h-7 w-16 shrink-0 rounded-lg" />
    </div>
  );
}
