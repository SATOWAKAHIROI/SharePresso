import { AppLayout } from "@/app/components/layout/AppLayout";
import { NotificationItem } from "@/app/components/notification/NotificationItem";
import { MarkAllReadButton } from "@/app/components/notification/MarkAllReadButton";
import { prisma } from "@/app/lib/prisma";
import { createClient } from "@/app/lib/supabase/server";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const notifications = user
    ? await prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 50,
        include: { actor: true, post: true },
      })
    : [];

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AppLayout>
      <div className="max-w-xl mx-auto px-4 py-8 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#1e3932]">通知</h1>
          {unreadCount > 0 && <MarkAllReadButton />}
        </div>

        {notifications.length === 0 ? (
          <p className="text-center text-gray-400 py-16 text-sm">通知はありません</p>
        ) : (
          <div className="space-y-1">
            {notifications.map((n) => (
              <NotificationItem key={n.id} notification={n} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
