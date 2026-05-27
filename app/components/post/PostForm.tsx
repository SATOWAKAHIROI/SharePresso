"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "./ImageUploader";
import { useToast } from "@/app/components/ui/Toast";

export function PostForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [images, setImages] = useState<File[]>([]);
  const [drinkName, setDrinkName] = useState("");
  const [content, setContent] = useState("");
  const [customDetail, setCustomDetail] = useState("");
  const [hashtags, setHashtags] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!drinkName || !content) return;

    const formData = new FormData();
    formData.append("drinkName", drinkName);
    formData.append("content", content);
    formData.append("customDetail", customDetail);
    formData.append("hashtags", hashtags);
    images.forEach((img) => formData.append("images", img));

    startTransition(async () => {
      const res = await fetch("/api/posts", { method: "POST", body: formData });
      if (res.ok) {
        showToast("投稿しました");
        router.push("/");
        router.refresh();
      } else {
        showToast("投稿に失敗しました", "error");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ドリンク名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={drinkName}
          onChange={(e) => setDrinkName(e.target.value)}
          placeholder="例: ソイラテ"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1e3932] text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          カスタム内容
        </label>
        <input
          type="text"
          value={customDetail}
          onChange={(e) => setCustomDetail(e.target.value)}
          placeholder="例: シロップ少なめ・豆乳変更"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1e3932] text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          説明文 <span className="text-red-500">*</span>
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="このカスタムのおすすめポイントを書いてください"
          rows={4}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1e3932] text-sm resize-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ハッシュタグ
        </label>
        <input
          type="text"
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
          placeholder="例: #ラテ #おすすめ（スペース区切り）"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1e3932] text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          写真
        </label>
        <ImageUploader images={images} onChange={setImages} />
      </div>

      <button
        type="submit"
        disabled={isPending || !drinkName || !content}
        className="w-full py-3 bg-[#1e3932] text-white rounded-xl font-medium hover:bg-[#2d4f45] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "投稿中..." : "投稿する"}
      </button>
    </form>
  );
}
