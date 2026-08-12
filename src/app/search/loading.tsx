import { Skeleton } from "@/components/ui/skeleton";

function TrackRowSkeleton() {
  return (
    <div className="flex items-center gap-3 p-2">
      <Skeleton className="size-9 shrink-0 rounded-full" />
      <Skeleton className="size-12 shrink-0 rounded-md" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  );
}

export default function SearchLoading() {
  return (
    <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-[1fr_380px]">
      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-10 w-44" />
        </div>

        <Skeleton className="h-12 w-full" />

        <Skeleton className="h-8 w-32" />
        <div className="flex flex-col gap-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <TrackRowSkeleton key={i} />
          ))}
        </div>
      </div>

      <div className="lg:sticky lg:top-8 lg:self-start">
        <div className="flex flex-col gap-5">
          <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-8" />
          </div>
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  );
}
