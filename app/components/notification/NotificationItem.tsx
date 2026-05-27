import Image from "next/image";
import Link from "next/link";
import { Prisma, NotificationType } from "@prisma/client";

type NotificationWithRelations = Prisma.NotificationGetPayload<{
  include: { actor: true; post: true };
}>;

const messageMap: Record<NotificationType, string> = {
  LIKE: "があなたの投稿にいいねしました",
  REPOST: "があなたの投稿をリポストしました",
  QUOTE: "があなたの投稿を引用リポストしました",
  FOLLOW: "があなたをフォローしました",
};

const emojiMap: Record<NotificationType, string> = {
  LIKE: "❤️",
  REPOST: "🔁",
  QUOTE: "💬",
  FOLLOW: "👤",
};

export function NotificationItem({ notification }: { notification: NotificationWithRelations }) {
  const href = notification.postId
    ? `/posts/${notification.postId}`
    : `/users/${notification.actorId}`;

  return (
    <Link
      href={href}
      className={`flex items-start gap-3 p-4 rounded-2xl transition-colors hover:bg-gray-50 ${
        !notification.isRead ? "bg-[#f0f7f4]" : "bg-white"
      }`}
    >
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
          {notification.actor.avatarUrl ? (
            <Image
              src={notification.actor.avatarUrl}
              alt={notification.actor.name}
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm font-bold">
              {notification.actor.name[0]}
            </div>
          )}
        </div>
        <span className="absolute -bottom-1 -right-1 text-sm">
          {emojiMap[notification.type]}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800">
          <span className="font-semibold">{notification.actor.name}</span>
          {messageMap[notification.type]}
        </p>
        {notification.post && (
          <p className="text-xs text-gray-400 mt-0.5 truncate">
            ☕ {notification.post.drinkName}
          </p>
        )}
        <p className="text-xs text-gray-400 mt-0.5">
          {new Date(notification.createdAt).toLocaleDateString("ja-JP")}
        </p>
      </div>

      {!notification.isRead && (
        <div className="w-2 h-2 rounded-full bg-[#1e3932] flex-shrink-0 mt-2" />
      )}
    </Link>
  );
}
