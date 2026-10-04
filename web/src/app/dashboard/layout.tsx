import Link from "next/link";
import { logout } from "./actions";
import SidebarNav from "./SidebarNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-l border-slate-200 shadow-sm flex flex-col z-20 print:hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-sky-700">DentalSaaS</h2>
        </div>
        <SidebarNav />
        <div className="p-4 border-t border-slate-100">
          <form action={logout}>
            <button type="submit" className="w-full p-2 text-red-600 hover:bg-red-50 rounded-md font-medium transition-colors text-right">
              تسجيل الخروج
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8 relative print:p-0 print:overflow-visible">
        {children}
      </main>
    </div>
  );
}
