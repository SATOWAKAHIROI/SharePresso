"use client";

import { useState, useTransition } from "react";

interface Props {
  postId: string;
  initialCount: number;
  initialLiked: boolean;
}

export function LikeButton({ postId, initialCount, initialLiked }: Props) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();

  const toggle = () => {
    const next = !liked;
    setLiked(next);
    setCount((c) => c + (next ? 1 : -1));

    startTransition(async () => {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: next ? "POST" : "DELETE",
      });
      if (!res.ok) {
        setLiked(!next);
        setCount((c) => c + (next ? -1 : 1));
      } else {
        const data = await res.json() as { count: number };
        setCount(data.count);
      }
    });
  };

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className={`flex items-center gap-1.5 text-sm transition-colors disabled:opacity-50 ${
        liked ? "text-red-500" : "text-gray-400 hover:text-red-400"
      }`}
    >
      <span>{liked ? "❤️" : "🤍"}</span>
      <span>{count}</span>
    </button>
  );
}
