import { UserListRowSkeleton } from "@/components/profile/user-list-row-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function FollowersLoading() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-8">
      <Skeleton className="h-6 w-48" />
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <UserListRowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
