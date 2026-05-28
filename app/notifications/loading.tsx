import { StaticLayout } from "@/app/components/layout/StaticLayout";
import { Skeleton } from "@/app/components/ui/Skeleton";

export default function Loading() {
  return (
    <StaticLayout>
      <div className="max-w-xl mx-auto px-4 py-8 space-y-4">
        <div className="h-7 w-24 bg-gray-200 rounded-xl animate-pulse mb-2" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 flex items-start gap-3">
            <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </StaticLayout>
  );
}
