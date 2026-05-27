"use client";

import { useState, useTransition } from "react";
import { useToast } from "@/app/components/ui/Toast";

interface Props {
  postId: string;
  onClose: () => void;
  onSuccess: (count: number) => void;
}

export function QuoteModal({ postId, onClose, onSuccess }: Props) {
  const { showToast } = useToast();
  const [comment, setComment] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    startTransition(async () => {
      const res = await fetch(`/api/posts/${postId}/repost`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "QUOTE", comment }),
      });
      if (res.ok) {
        const data = await res.json() as { count: number };
        onSuccess(data.count);
        showToast("引用リポストしました");
        onClose();
      } else {
        showToast("失敗しました", "error");
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 space-y-4">
        <h2 className="font-bold text-[#1e3932]">引用リポスト</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="コメントを入力..."
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1e3932] text-sm resize-none"
            required
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isPending || !comment.trim()}
              className="flex-1 py-2.5 rounded-xl bg-[#1e3932] text-white text-sm font-medium hover:bg-[#2d4f45] transition-colors disabled:opacity-50"
            >
              {isPending ? "投稿中..." : "引用する"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
