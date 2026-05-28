import { StaticLayout } from "@/app/components/layout/StaticLayout";
import { PostCardSkeleton } from "@/app/components/ui/Skeleton";

export default function Loading() {
  return (
    <StaticLayout>
      <div className="max-w-xl mx-auto px-4 py-8">
        <PostCardSkeleton />
      </div>
    </StaticLayout>
  );
}
