"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "ホーム", emoji: "🏠" },
  { href: "/search", label: "検索", emoji: "🔍" },
  { href: "/posts/new", label: "投稿", emoji: "✏️" },
  { href: "/notifications", label: "通知", emoji: "🔔" },
  { href: "/following", label: "フォロー", emoji: "👥" },
];

export function BottomNav({ unreadCount = 0 }: { unreadCount?: number }) {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-10">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 px-3 py-2 text-xs transition-colors relative ${
              pathname === item.href ? "text-[#1e3932] font-semibold" : "text-gray-400"
            }`}
          >
            <span className="text-xl">{item.emoji}</span>
            {item.href === "/notifications" && unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-1 py-0.5 rounded-full min-w-[16px] text-center leading-none">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
