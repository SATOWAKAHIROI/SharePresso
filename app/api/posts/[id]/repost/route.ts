import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { prisma } from "@/app/lib/prisma";
import { createNotification } from "@/app/lib/notification";
import { RepostType } from "@/app/generated/prisma";

type Context = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, ctx: Context) {
  const { id: postId } = await ctx.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json() as { type: RepostType; comment?: string };
  const { type, comment } = body;

  const existing = await prisma.repost.findFirst({ where: { userId: user.id, postId, type } });
  if (existing) return NextResponse.json({ error: "Already reposted" }, { status: 409 });

  await prisma.repost.create({
    data: { userId: user.id, postId, type, comment: comment ?? null },
  });

  const post = await prisma.post.findUnique({ where: { id: postId }, select: { authorId: true } });
  if (post) {
    await createNotification({
      userId: post.authorId,
      actorId: user.id,
      type: type === "QUOTE" ? "QUOTE" : "REPOST",
      postId,
    });
  }

  const count = await prisma.repost.count({ where: { postId } });
  return NextResponse.json({ count });
}

export async function DELETE(request: NextRequest, ctx: Context) {
  const { id: postId } = await ctx.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const type = (searchParams.get("type") ?? "REPOST") as RepostType;

  await prisma.repost.deleteMany({ where: { userId: user.id, postId, type } });

  const count = await prisma.repost.count({ where: { postId } });
  return NextResponse.json({ count });
}
