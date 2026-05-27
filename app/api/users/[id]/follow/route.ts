import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { prisma } from "@/app/lib/prisma";
import { createNotification } from "@/app/lib/notification";

type Context = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, ctx: Context) {
  const { id: followingId } = await ctx.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.id === followingId) return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId: user.id, followingId } },
  });
  if (existing) return NextResponse.json({ error: "Already following" }, { status: 409 });

  await prisma.follow.create({ data: { followerId: user.id, followingId } });
  await createNotification({ userId: followingId, actorId: user.id, type: "FOLLOW" });

  return NextResponse.json({ following: true });
}

export async function DELETE(_request: NextRequest, ctx: Context) {
  const { id: followingId } = await ctx.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.follow.deleteMany({ where: { followerId: user.id, followingId } });
  return NextResponse.json({ following: false });
}
