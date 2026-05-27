import Link from "next/link";
import { signOut } from "@/app/actions/auth";

const navItems = [
  { href: "/", label: "ホーム", emoji: "🏠" },
  { href: "/following", label: "フォロー中", emoji: "👥" },
  { href: "/search", label: "検索", emoji: "🔍" },
  { href: "/notifications", label: "通知", emoji: "🔔" },
  { href: "/posts/new", label: "投稿する", emoji: "✏️" },
];

export function Sidebar({ unreadCount = 0 }: { unreadCount?: number }) {
  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 p-4 border-r border-gray-100 bg-white">
      <div className="mb-8 px-2">
        <span className="text-xl font-bold text-[#1e3932]">☕ SharePresso</span>
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-[#f9f5f0] transition-colors font-medium"
          >
            <span>{item.emoji}</span>
            <span className="flex-1">{item.label}</span>
            {item.href === "/notifications" && unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Link>
        ))}
      </nav>
      <form action={signOut}>
        <button
          type="submit"
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors text-sm"
        >
          <span>🚪</span>
          <span>ログアウト</span>
        </button>
      </form>
    </aside>
  );
}
