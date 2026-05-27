import { createClient } from "@/app/lib/supabase/server";
import { prisma } from "@/app/lib/prisma";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";

export async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const unreadCount = user
    ? await prisma.notification.count({
        where: { userId: user.id, isRead: false },
      })
    : 0;

  return (
    <div className="flex min-h-screen bg-[#f9f5f0]">
      <Sidebar unreadCount={unreadCount} />
      <main className="flex-1 min-h-screen pb-16 md:pb-0">{children}</main>
      <BottomNav unreadCount={unreadCount} />
    </div>
  );
}
