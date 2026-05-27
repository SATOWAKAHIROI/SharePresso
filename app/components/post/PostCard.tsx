import Image from "next/image";
import Link from "next/link";
import { Prisma } from "@/app/generated/prisma";
import { LikeButton } from "./LikeButton";
import { RepostButton } from "./RepostButton";

export type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    author: true;
    images: true;
    likes: true;
    reposts: true;
    hashtags: { include: { hashtag: true } };
  };
}>;

interface Props {
  post: PostWithRelations;
  currentUserId?: string;
}

export function PostCard({ post, currentUserId }: Props) {
  const liked = currentUserId
    ? post.likes.some((l) => l.userId === currentUserId)
    : false;
  const reposted = currentUserId
    ? post.reposts.some((r) => r.userId === currentUserId && r.type === "REPOST")
    : false;

  return (
    <article className="bg-white rounded-2xl p-4 space-y-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
          {post.author.avatarUrl ? (
            <Image
              src={post.author.avatarUrl}
              alt={post.author.name}
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm font-bold">
              {post.author.name[0]}
            </div>
          )}
        </div>
        <div>
          <Link
            href={`/users/${post.author.id}`}
            className="font-semibold text-sm text-gray-900 hover:underline"
          >
            {post.author.name}
          </Link>
          <p className="text-xs text-gray-400">
            {new Date(post.createdAt).toLocaleDateString("ja-JP")}
          </p>
        </div>
      </div>

      <Link href={`/posts/${post.id}`} className="block space-y-1">
        <h2 className="font-bold text-[#1e3932]">☕ {post.drinkName}</h2>
        {post.customDetail && (
          <p className="text-xs text-gray-500">{post.customDetail}</p>
        )}
        <p className="text-sm text-gray-700 line-clamp-3">{post.content}</p>
      </Link>

      {post.images.length > 0 && (
        <div
          className={`grid gap-1 ${post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}
        >
          {post.images.slice(0, 4).map((img) => (
            <div
              key={img.id}
              className="relative aspect-square rounded-xl overflow-hidden bg-gray-100"
            >
              <Image src={img.url} alt="" fill className="object-cover" />
            </div>
          ))}
        </div>
      )}

      {post.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {post.hashtags.map(({ hashtag }) => (
            <Link
              key={hashtag.id}
              href={`/search?q=${hashtag.name}`}
              className="text-xs text-[#1e3932] hover:underline"
            >
              #{hashtag.name}
            </Link>
          ))}
        </div>
      )}

      <div className="flex gap-5 pt-1 border-t border-gray-50">
        <LikeButton
          postId={post.id}
          initialCount={post.likes.length}
          initialLiked={liked}
        />
        <RepostButton
          postId={post.id}
          initialCount={post.reposts.length}
          initialReposted={reposted}
        />
      </div>
    </article>
  );
}
