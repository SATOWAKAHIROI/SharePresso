import Image from "next/image";
import Link from "next/link";
import { FollowButton } from "./FollowButton";
import { Prisma } from "@/app/generated/prisma";

type UserWithCount = Prisma.UserGetPayload<{
  include: { _count: { select: { posts: true; followers: true; following: true } } };
}>;

interface Props {
  user: UserWithCount;
  currentUserId?: string;
  isFollowing: boolean;
}

export function ProfileHeader({ user, currentUserId, isFollowing }: Props) {
  const isOwnProfile = currentUserId === user.id;

  return (
    <div className="bg-white rounded-2xl p-6 space-y-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.name}
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl font-bold">
              {user.name[0]}
            </div>
          )}
        </div>
        {isOwnProfile ? (
          <Link
            href={`/users/${user.id}/edit`}
            className="px-4 py-2 rounded-full text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            プロフィール編集
          </Link>
        ) : currentUserId ? (
          <FollowButton userId={user.id} initialFollowing={isFollowing} />
        ) : null}
      </div>

      <div>
        <h1 className="text-lg font-bold text-gray-900">{user.name}</h1>
        {user.bio && <p className="text-sm text-gray-600 mt-1">{user.bio}</p>}
      </div>

      <div className="flex gap-6 text-sm">
        <div>
          <span className="font-bold text-gray-900">{user._count.posts}</span>
          <span className="text-gray-500 ml-1">投稿</span>
        </div>
        <div>
          <span className="font-bold text-gray-900">{user._count.following}</span>
          <span className="text-gray-500 ml-1">フォロー中</span>
        </div>
        <div>
          <span className="font-bold text-gray-900">{user._count.followers}</span>
          <span className="text-gray-500 ml-1">フォロワー</span>
        </div>
      </div>
    </div>
  );
}
