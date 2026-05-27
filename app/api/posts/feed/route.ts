import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { prisma } from "@/app/lib/prisma";

const LIMIT = 10;

const postInclude = {
  author: true,
  images: { orderBy: { order: "asc" as const } },
  hashtags: { include: { hashtag: true } },
  likes: true,
  reposts: true,
};

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? "all";
  const cursor = searchParams.get("cursor");
  const userId = searchParams.get("userId");

  const cursorFilter = cursor ? { createdAt: { lt: new Date(cursor) } } : {};

  let where = {};

  if (userId) {
    where = { ...cursorFilter, authorId: userId };
  } else if (type === "following") {
    const follows = await prisma.follow.findMany({
      where: { followerId: user.id },
      select: { followingId: true },
    });
    const followingIds = follows.map((f) => f.followingId);
    where = { ...cursorFilter, authorId: { in: followingIds } };
  } else {
    where = cursorFilter;
  }

  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: LIMIT + 1,
    include: postInclude,
  });

  const hasMore = posts.length > LIMIT;
  const result = hasMore ? posts.slice(0, LIMIT) : posts;
  const nextCursor = hasMore
    ? result[result.length - 1].createdAt.toISOString()
    : null;

  return NextResponse.json({ posts: result, nextCursor });
}
