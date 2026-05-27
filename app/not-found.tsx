import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f5f0]">
      <div className="text-center space-y-4">
        <div className="text-6xl">☕</div>
        <h1 className="text-2xl font-bold text-[#1e3932]">ページが見つかりません</h1>
        <p className="text-sm text-gray-500">お探しのページは存在しないか、削除されました。</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-[#1e3932] text-white rounded-xl text-sm font-medium hover:bg-[#2d4f45] transition-colors"
        >
          ホームへ戻る
        </Link>
      </div>
    </div>
  );
}
