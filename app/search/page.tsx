import { AppLayout } from "@/app/components/layout/AppLayout";
import { SearchForm } from "@/app/components/search/SearchForm";
import { PostCard } from "@/app/components/post/PostCard";
import { prisma } from "@/app/lib/prisma";
import { createClient } from "@/app/lib/supabase/server";

const postInclude = {
  author: true,
  images: { orderBy: { order: "asc" as const } },
  hashtags: { include: { hashtag: true } },
  likes: true,
  reposts: true,
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const { q = "", type = "drink" } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let posts: Awaited<ReturnType<typeof prisma.post.findMany<{ include: typeof postInclude }>>> = [];

  if (q.trim()) {
    if (type === "hashtag") {
      const tag = q.replace(/^#/, "").toLowerCase();
      posts = await prisma.post.findMany({
        where: { hashtags: { some: { hashtag: { name: tag } } } },
        orderBy: { createdAt: "desc" },
        take: 20,
        include: postInclude,
      });
    } else {
      posts = await prisma.post.findMany({
        where: { drinkName: { contains: q, mode: "insensitive" } },
        orderBy: { createdAt: "desc" },
        take: 20,
        include: postInclude,
      });
    }
  }

  return (
    <AppLayout>
      <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-xl font-bold text-[#1e3932]">検索</h1>
        <SearchForm initialQ={q} initialType={type} />
        {q.trim() && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              「{q}」の検索結果：{posts.length} 件
            </p>
            {posts.length === 0 ? (
              <p className="text-center text-gray-400 py-12 text-sm">
                該当する投稿が見つかりませんでした
              </p>
            ) : (
              posts.map((post) => (
                <PostCard key={post.id} post={post} currentUserId={user?.id} />
              ))
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
