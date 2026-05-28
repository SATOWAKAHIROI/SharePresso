import { StaticLayout } from "@/app/components/layout/StaticLayout";
import { PostCardSkeleton } from "@/app/components/ui/Skeleton";

export default function Loading() {
  return (
    <StaticLayout>
      <div className="max-w-xl mx-auto px-4 py-8 space-y-4">
        <div className="h-10 w-full bg-gray-200 rounded-xl animate-pulse" />
        {[...Array(3)].map((_, i) => <PostCardSkeleton key={i} />)}
      </div>
    </StaticLayout>
  );
}
