import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { prisma } from "@/app/lib/prisma";
import { createNotification } from "@/app/lib/notification";

type Context = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, ctx: Context) {
  const { id: postId } = await ctx.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.like.findUnique({
    where: { userId_postId: { userId: user.id, postId } },
  });
  if (existing) return NextResponse.json({ error: "Already liked" }, { status: 409 });

  await prisma.like.create({ data: { userId: user.id, postId } });

  const post = await prisma.post.findUnique({ where: { id: postId }, select: { authorId: true } });
  if (post) {
    await createNotification({ userId: post.authorId, actorId: user.id, type: "LIKE", postId });
  }

  const count = await prisma.like.count({ where: { postId } });
  return NextResponse.json({ count });
}

export async function DELETE(_request: NextRequest, ctx: Context) {
  const { id: postId } = await ctx.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.like.deleteMany({ where: { userId: user.id, postId } });

  const count = await prisma.like.count({ where: { postId } });
  return NextResponse.json({ count });
}
