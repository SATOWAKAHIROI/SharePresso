import { AppLayout } from "@/app/components/layout/AppLayout";
import { PostForm } from "@/app/components/post/PostForm";

export default function NewPostPage() {
  return (
    <AppLayout>
      <div className="max-w-xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-[#1e3932] mb-6">投稿する</h1>
        <PostForm />
      </div>
    </AppLayout>
  );
}
