import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";

export function StaticLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f9f5f0]">
      <Sidebar />
      <main className="flex-1 min-h-screen pb-16 md:pb-0">{children}</main>
      <BottomNav />
    </div>
  );
}
