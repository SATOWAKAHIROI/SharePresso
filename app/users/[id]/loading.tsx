import { StaticLayout } from "@/app/components/layout/StaticLayout";
import { Skeleton, PostCardSkeleton } from "@/app/components/ui/Skeleton";

export default function Loading() {
  return (
    <StaticLayout>
      <div className="max-w-xl mx-auto px-4 py-8 space-y-4">
        <div className="bg-white rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-start justify-between">
            <Skeleton className="w-16 h-16 rounded-full" />
            <Skeleton className="h-9 w-28 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <div className="flex gap-6">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        {[...Array(2)].map((_, i) => <PostCardSkeleton key={i} />)}
      </div>
    </StaticLayout>
  );
}
