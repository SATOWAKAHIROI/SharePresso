"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/components/ui/Toast";

export function MarkAllReadButton() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await fetch("/api/notifications", { method: "PATCH" });
      showToast("すべて既読にしました");
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="text-sm text-[#1e3932] font-medium hover:underline disabled:opacity-50"
    >
      {isPending ? "処理中..." : "すべて既読にする"}
    </button>
  );
}
