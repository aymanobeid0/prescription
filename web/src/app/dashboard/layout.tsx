import Link from "next/link";
import { logout } from "./actions";
import SidebarNav from "./SidebarNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-900" dir="rtl">
      {/* Sidebar */}
      <aside className="w-full md:w-64 md:min-h-screen bg-white border-b md:border-b-0 md:border-l border-slate-200 shadow-sm flex flex-col z-20 print:hidden shrink-0">
        <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-bold text-sky-700">DentalSaaS</h2>
        </div>
        <div className="flex-1 overflow-auto md:overflow-visible flex flex-row md:flex-col">
          <SidebarNav />
        </div>
        <div className="p-4 border-t border-slate-100 hidden md:block">
          <form action={logout}>
            <button type="submit" className="w-full p-2 text-red-600 hover:bg-red-50 rounded-md font-medium transition-colors text-right">
              تسجيل الخروج
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 md:p-8 relative print:p-0 print:overflow-visible">
        <div className="max-w-6xl mx-auto w-full space-y-6 md:space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}



