"use client";

import { useState, useTransition } from "react";
import { PostCard } from "./PostCard";
import type { PostWithRelations } from "./PostCard";

interface Props {
  initialPosts: PostWithRelations[];
  initialCursor: string | null;
  type: "all" | "following";
  currentUserId?: string;
  userId?: string;
}

export function PostFeed({ initialPosts, initialCursor, type, currentUserId, userId }: Props) {
  const [posts, setPosts] = useState(initialPosts);
  const [cursor, setCursor] = useState(initialCursor);
  const [isPending, startTransition] = useTransition();

  const loadMore = () => {
    startTransition(async () => {
      const params = new URLSearchParams({ type });
      if (cursor) params.set("cursor", cursor);
      if (userId) params.set("userId", userId);
      const url = `/api/posts/feed?${params.toString()}`;
      const res = await fetch(url);
      const data = await res.json() as { posts: PostWithRelations[]; nextCursor: string | null };
      setPosts((prev) => [...prev, ...data.posts]);
      setCursor(data.nextCursor);
    });
  };

  if (posts.length === 0) {
    return (
      <p className="text-center text-gray-400 py-16 text-sm">
        {type === "following" ? "フォロー中のユーザーの投稿がありません" : "まだ投稿がありません"}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} currentUserId={currentUserId} />
      ))}
      {cursor && (
        <button
          onClick={loadMore}
          disabled={isPending}
          className="w-full py-3 text-sm text-[#1e3932] font-medium hover:bg-white rounded-xl transition-colors disabled:opacity-50"
        >
          {isPending ? "読み込み中..." : "もっと見る"}
        </button>
      )}
    </div>
  );
}
