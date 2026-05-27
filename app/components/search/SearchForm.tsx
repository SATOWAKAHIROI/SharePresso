"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  initialQ: string;
  initialType: string;
}

export function SearchForm({ initialQ, initialType }: Props) {
  const router = useRouter();
  const [q, setQ] = useState(initialQ);
  const [type, setType] = useState(initialType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/search?q=${encodeURIComponent(q.trim())}&type=${type}`);
  };

  const handleTypeChange = (newType: string) => {
    setType(newType);
    if (q.trim()) {
      router.push(`/search?q=${encodeURIComponent(q.trim())}&type=${newType}`);
    }
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={type === "hashtag" ? "#ラテ" : "ソイラテ"}
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1e3932] text-sm"
        />
        <button
          type="submit"
          className="px-5 py-2.5 bg-[#1e3932] text-white rounded-xl text-sm font-medium hover:bg-[#2d4f45] transition-colors"
        >
          検索
        </button>
      </form>
      <div className="flex gap-2">
        {["drink", "hashtag"].map((t) => (
          <button
            key={t}
            onClick={() => handleTypeChange(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              type === t
                ? "bg-[#1e3932] text-white"
                : "border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {t === "drink" ? "ドリンク名" : "ハッシュタグ"}
          </button>
        ))}
      </div>
    </div>
  );
}
