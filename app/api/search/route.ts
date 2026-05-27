import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { prisma } from "@/app/lib/prisma";

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
  const q = searchParams.get("q")?.trim() ?? "";
  const type = searchParams.get("type") ?? "drink";

  if (!q) return NextResponse.json({ posts: [] });

  let posts;

  if (type === "hashtag") {
    const tag = q.replace(/^#/, "").toLowerCase();
    posts = await prisma.post.findMany({
      where: {
        hashtags: { some: { hashtag: { name: tag } } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: postInclude,
    });
  } else {
    posts = await prisma.post.findMany({
      where: {
        drinkName: { contains: q, mode: "insensitive" },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: postInclude,
    });
  }

  return NextResponse.json({ posts });
}
