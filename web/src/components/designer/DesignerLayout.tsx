"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

import { useDesignerStore } from "@/store/useDesignerStore";
import SidebarPalette from "./SidebarPalette";
import CanvasArea from "./CanvasArea";
import PropertiesPanel from "./PropertiesPanel";
import TopBarActions from "./TopBarActions";

interface Props {
  patientId?: string;
}

export default function DesignerLayout({ patientId }: Props) {
  const [mounted, setMounted] = useState(false);
  const { previewMode, docs, docType } = useDesignerStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-screen flex items-center justify-center bg-slate-100 text-slate-500">جاري تحميل المصمم...</div>;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-100" dir="rtl">
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-20">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-slate-500 hover:text-sky-600 transition-colors flex items-center gap-1 text-sm font-bold bg-slate-100 px-3 py-1.5 rounded border">
            &rarr; الرئيسية
          </Link>
          <h2 className="font-bold text-sky-800">مصمم المستندات</h2>
        </div>
        <TopBarActions patientId={patientId || ""} />
      </header>
      <div className="flex flex-1 overflow-hidden">
        {!previewMode && (
          <aside className="w-64 bg-white border-l border-slate-200 shadow-sm flex flex-col z-10">
            <SidebarPalette />
          </aside>
        )}
        
        <main className="flex-1 relative overflow-auto">
          <CanvasArea />
        </main>

        {!previewMode && (
          <aside className="w-72 bg-white border-r border-slate-200 shadow-sm flex flex-col z-10 overflow-y-auto">
            <PropertiesPanel />
          </aside>
        )}
      </div>
    </div>
  );
}
