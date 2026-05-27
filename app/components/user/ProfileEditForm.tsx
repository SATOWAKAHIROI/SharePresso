"use client";

import { useState, useTransition, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/components/ui/Toast";

interface Props {
  user: {
    id: string;
    name: string;
    bio: string | null;
    avatarUrl: string | null;
  };
}

export function ProfileEditForm({ user }: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatarUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    if (avatarFile) formData.append("avatar", avatarFile);

    startTransition(async () => {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        body: formData,
      });
      if (res.ok) {
        showToast("プロフィールを更新しました");
        router.push(`/users/${user.id}`);
        router.refresh();
      } else {
        showToast("更新に失敗しました", "error");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => inputRef.current?.click()}
        >
          {avatarPreview ? (
            <Image
              src={avatarPreview}
              alt=""
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl font-bold">
              {name[0]}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-sm text-[#1e3932] font-medium hover:underline"
        >
          アイコンを変更
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          表示名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1e3932] text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          自己紹介
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          placeholder="自己紹介を入力..."
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1e3932] text-sm resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isPending || !name}
        className="w-full py-3 bg-[#1e3932] text-white rounded-xl font-medium hover:bg-[#2d4f45] transition-colors disabled:opacity-50"
      >
        {isPending ? "更新中..." : "保存する"}
      </button>
    </form>
  );
}
