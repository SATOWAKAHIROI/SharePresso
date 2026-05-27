import { AppLayout } from "@/app/components/layout/AppLayout";
import { PostFeed } from "@/app/components/post/PostFeed";
import { prisma } from "@/app/lib/prisma";
import { createClient } from "@/app/lib/supabase/server";

const LIMIT = 10;

export default async function FollowingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const followingIds = user
    ? (
        await prisma.follow.findMany({
          where: { followerId: user.id },
          select: { followingId: true },
        })
      ).map((f) => f.followingId)
    : [];

  const posts = await prisma.post.findMany({
    where: { authorId: { in: followingIds } },
    orderBy: { createdAt: "desc" },
    take: LIMIT + 1,
    include: {
      author: true,
      images: { orderBy: { order: "asc" } },
      hashtags: { include: { hashtag: true } },
      likes: true,
      reposts: true,
    },
  });

  const hasMore = posts.length > LIMIT;
  const initialPosts = hasMore ? posts.slice(0, LIMIT) : posts;
  const initialCursor = hasMore
    ? initialPosts[initialPosts.length - 1].createdAt.toISOString()
    : null;

  return (
    <AppLayout>
      <div className="max-w-xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-[#1e3932] mb-6">フォロー中</h1>
        <PostFeed
          initialPosts={initialPosts}
          initialCursor={initialCursor}
          type="following"
          currentUserId={user?.id}
        />
      </div>
    </AppLayout>
  );
}
