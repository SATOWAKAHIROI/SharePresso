"use client";

import { useState, useTransition } from "react";
import { useToast } from "@/app/components/ui/Toast";

interface Props {
  userId: string;
  initialFollowing: boolean;
}

export function FollowButton({ userId, initialFollowing }: Props) {
  const { showToast } = useToast();
  const [following, setFollowing] = useState(initialFollowing);
  const [isPending, startTransition] = useTransition();

  const toggle = () => {
    const next = !following;
    setFollowing(next);

    startTransition(async () => {
      const res = await fetch(`/api/users/${userId}/follow`, {
        method: next ? "POST" : "DELETE",
      });
      if (!res.ok) {
        setFollowing(!next);
        showToast("失敗しました", "error");
      } else {
        showToast(next ? "フォローしました" : "フォロー解除しました");
      }
    });
  };

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className={`px-5 py-2 rounded-full text-sm font-medium transition-colors disabled:opacity-50 ${
        following
          ? "border border-gray-300 text-gray-700 hover:border-red-300 hover:text-red-500"
          : "bg-[#1e3932] text-white hover:bg-[#2d4f45]"
      }`}
    >
      {following ? "フォロー中" : "フォロー"}
    </button>
  );
}
