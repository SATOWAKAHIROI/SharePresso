"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f5f0]">
      <div className="text-center space-y-4">
        <div className="text-6xl">☕</div>
        <h1 className="text-2xl font-bold text-[#1e3932]">エラーが発生しました</h1>
        <p className="text-sm text-gray-500">しばらく時間をおいて再度お試しください。</p>
        <button
          onClick={reset}
          className="inline-block px-6 py-3 bg-[#1e3932] text-white rounded-xl text-sm font-medium hover:bg-[#2d4f45] transition-colors"
        >
          再試行する
        </button>
      </div>
    </div>
  );
}
