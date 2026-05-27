import { prisma } from "./prisma";
import { NotificationType } from "@/app/generated/prisma";

export async function createNotification({
  userId,
  actorId,
  type,
  postId,
}: {
  userId: string;
  actorId: string;
  type: NotificationType;
  postId?: string;
}) {
  if (userId === actorId) return;
  await prisma.notification.create({
    data: { userId, actorId, type, postId: postId ?? null },
  });
}
