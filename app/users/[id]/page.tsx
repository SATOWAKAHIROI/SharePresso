import { notFound } from "next/navigation";
import { AppLayout } from "@/app/components/layout/AppLayout";
import { ProfileHeader } from "@/app/components/user/ProfileHeader";
import { PostFeed } from "@/app/components/post/PostFeed";
import { prisma } from "@/app/lib/prisma";
import { createClient } from "@/app/lib/supabase/server";

const LIMIT = 10;

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();

  const [profileUser, posts, follow] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: { posts: true, followers: true, following: true },
        },
      },
    }),
    prisma.post.findMany({
      where: { authorId: id },
      orderBy: { createdAt: "desc" },
      take: LIMIT + 1,
      include: {
        author: true,
        images: { orderBy: { order: "asc" } },
        hashtags: { include: { hashtag: true } },
        likes: true,
        reposts: true,
      },
    }),
    currentUser
      ? prisma.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: currentUser.id,
              followingId: id,
            },
          },
        })
      : null,
  ]);

  if (!profileUser) notFound();

  const hasMore = posts.length > LIMIT;
  const initialPosts = hasMore ? posts.slice(0, LIMIT) : posts;
  const initialCursor = hasMore
    ? initialPosts[initialPosts.length - 1].createdAt.toISOString()
    : null;

  return (
    <AppLayout>
      <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
        <ProfileHeader
          user={profileUser}
          currentUserId={currentUser?.id}
          isFollowing={!!follow}
        />
        <PostFeed
          initialPosts={initialPosts}
          initialCursor={initialCursor}
          type="all"
          currentUserId={currentUser?.id}
          userId={id}
        />
      </div>
    </AppLayout>
  );
}
