import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { prisma } from "@/app/lib/prisma";
import { uploadPostImage } from "@/app/lib/supabase/storage";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const drinkName = formData.get("drinkName") as string;
  const content = formData.get("content") as string;
  const customDetail = formData.get("customDetail") as string;
  const hashtagsRaw = formData.get("hashtags") as string;
  const imageFiles = formData.getAll("images") as File[];

  if (!drinkName || !content) {
    return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
  }

  const imageUrls = await Promise.all(
    imageFiles.slice(0, 4).map((file) => uploadPostImage(file, user.id))
  );

  const hashtagNames = hashtagsRaw
    ? [...new Set(
        hashtagsRaw.split(/[\s,]+/).filter(Boolean).map((h) => h.replace(/^#/, "").toLowerCase())
      )]
    : [];

  const hashtagRecords = await Promise.all(
    hashtagNames.map((name) =>
      prisma.hashtag.upsert({ where: { name }, update: {}, create: { name } })
    )
  );

  const post = await prisma.post.create({
    data: {
      authorId: user.id,
      drinkName,
      content,
      customDetail: customDetail || null,
      images: {
        create: imageUrls.map((url, i) => ({ url, order: i })),
      },
      hashtags: {
        create: hashtagRecords.map((h) => ({ hashtagId: h.id })),
      },
    },
    include: {
      author: true,
      images: { orderBy: { order: "asc" } },
      hashtags: { include: { hashtag: true } },
    },
  });

  return NextResponse.json(post, { status: 201 });
}
