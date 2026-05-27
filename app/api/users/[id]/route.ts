import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { prisma } from "@/app/lib/prisma";
import { uploadAvatarImage } from "@/app/lib/supabase/storage";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, ctx: Context) {
  const { id } = await ctx.params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      _count: {
        select: { posts: true, followers: true, following: true },
      },
    },
  });

  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(user);
}

export async function PATCH(request: NextRequest, ctx: Context) {
  const { id } = await ctx.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.id !== id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const formData = await request.formData();
  const name = formData.get("name") as string;
  const bio = formData.get("bio") as string;
  const avatarFile = formData.get("avatar") as File | null;

  let avatarUrl: string | undefined;
  if (avatarFile && avatarFile.size > 0) {
    avatarUrl = await uploadAvatarImage(avatarFile, user.id);
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(name && { name }),
      bio: bio || null,
      ...(avatarUrl && { avatarUrl }),
    },
  });

  return NextResponse.json(updated);
}
