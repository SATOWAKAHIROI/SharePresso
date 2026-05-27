import { notFound, redirect } from "next/navigation";
import { AppLayout } from "@/app/components/layout/AppLayout";
import { ProfileEditForm } from "@/app/components/user/ProfileEditForm";
import { prisma } from "@/app/lib/prisma";
import { createClient } from "@/app/lib/supabase/server";

export default async function ProfileEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.id !== id) redirect(`/users/${id}`);

  const profileUser = await prisma.user.findUnique({ where: { id } });
  if (!profileUser) notFound();

  return (
    <AppLayout>
      <div className="max-w-xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-[#1e3932] mb-6">プロフィール編集</h1>
        <ProfileEditForm user={profileUser} />
      </div>
    </AppLayout>
  );
}
