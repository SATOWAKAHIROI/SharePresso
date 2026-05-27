import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { prisma } from "@/app/lib/prisma";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, ctx: Context) {
  const { id } = await ctx.params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: true,
      images: { orderBy: { order: "asc" } },
      hashtags: { include: { hashtag: true } },
      likes: true,
      reposts: true,
    },
  });

  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PATCH(request: NextRequest, ctx: Context) {
  const { id } = await ctx.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (post.authorId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json() as { drinkName?: string; content?: string; customDetail?: string };
  const updated = await prisma.post.update({
    where: { id },
    data: {
      ...(body.drinkName && { drinkName: body.drinkName }),
      ...(body.content && { content: body.content }),
      customDetail: body.customDetail ?? post.customDetail,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, ctx: Context) {
  const { id } = await ctx.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (post.authorId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
