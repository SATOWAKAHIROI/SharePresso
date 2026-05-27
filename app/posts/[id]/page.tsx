import { AppLayout } from "@/app/components/layout/AppLayout";
import { PostCard } from "@/app/components/post/PostCard";
import { prisma } from "@/app/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: true, images: { orderBy: { order: "asc" }, take: 1 } },
  });
  if (!post) return {};

  const title = `${post.drinkName} by ${post.author.name}`;
  const description = post.content.slice(0, 120);
  const image = post.images[0]?.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(image && { images: [{ url: image }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image && { images: [image] }),
    },
  };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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

  if (!post) notFound();

  return (
    <AppLayout>
      <div className="max-w-xl mx-auto px-4 py-8">
        <PostCard post={post} />
      </div>
    </AppLayout>
  );
}
