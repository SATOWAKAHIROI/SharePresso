"use client";

import { useState, useTransition } from "react";
import { QuoteModal } from "./QuoteModal";
import { useToast } from "@/app/components/ui/Toast";

interface Props {
  postId: string;
  initialCount: number;
  initialReposted: boolean;
}

export function RepostButton({ postId, initialCount, initialReposted }: Props) {
  const { showToast } = useToast();
  const [reposted, setReposted] = useState(initialReposted);
  const [count, setCount] = useState(initialCount);
  const [showMenu, setShowMenu] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSimpleRepost = () => {
    setShowMenu(false);
    const next = !reposted;
    setReposted(next);
    setCount((c) => c + (next ? 1 : -1));

    startTransition(async () => {
      const res = await fetch(
        `/api/posts/${postId}/repost${next ? "" : "?type=REPOST"}`,
        {
          method: next ? "POST" : "DELETE",
          ...(next && {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "REPOST" }),
          }),
        }
      );
      if (res.ok) {
        const data = await res.json() as { count: number };
        setCount(data.count);
        if (next) showToast("リポストしました");
      } else {
        setReposted(!next);
        setCount((c) => c + (next ? -1 : 1));
      }
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu((v) => !v)}
        disabled={isPending}
        className={`flex items-center gap-1.5 text-sm transition-colors disabled:opacity-50 ${
          reposted ? "text-green-600" : "text-gray-400 hover:text-green-500"
        }`}
      >
        <span>🔁</span>
        <span>{count}</span>
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
          <div className="absolute bottom-8 left-0 bg-white rounded-xl shadow-lg border border-gray-100 z-20 w-40 overflow-hidden">
            <button
              onClick={handleSimpleRepost}
              className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
            >
              {reposted ? "リポスト解除" : "リポスト"}
            </button>
            <button
              onClick={() => { setShowMenu(false); setShowQuote(true); }}
              className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
            >
              引用リポスト
            </button>
          </div>
        </>
      )}

      {showQuote && (
        <QuoteModal
          postId={postId}
          onClose={() => setShowQuote(false)}
          onSuccess={(newCount) => setCount(newCount)}
        />
      )}
    </div>
  );
}
