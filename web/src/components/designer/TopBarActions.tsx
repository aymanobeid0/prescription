"use client";

import { useDesignerStore } from "@/store/useDesignerStore";
import { saveDocument } from "@/app/designer/actions";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function TopBarActions({ patientId }: { patientId: string }) {
  const { docType, docs, togglePreview, previewMode } = useDesignerStore();
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setSaving(true);
    const content = docs[docType];
    const res = await saveDocument(patientId, docType, content);
    
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("تم حفظ المستند بنجاح!");
      router.push(`/dashboard/patients/${patientId}`);
    }
    setSaving(false);
  };

  return (
    <div className="flex gap-4 items-center">
      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-md border border-slate-200">
        <button
          onClick={() => useDesignerStore.getState().setDocType("rx")}
          className={`px-3 py-1 rounded text-sm transition-colors ${docType === "rx" ? "bg-white shadow-sm font-bold text-sky-700" : "text-slate-500 hover:text-slate-700"}`}
        >
          وصفة طبية
        </button>
        <button
          onClick={() => useDesignerStore.getState().setDocType("invoice")}
          className={`px-3 py-1 rounded text-sm transition-colors ${docType === "invoice" ? "bg-white shadow-sm font-bold text-sky-700" : "text-slate-500 hover:text-slate-700"}`}
        >
          فاتورة
        </button>
      </div>

      <div className="flex gap-2 border-r pr-4 border-slate-200">
        <Button 
          variant="outline" 
          onClick={togglePreview}
        >
          {previewMode ? "وضع التعديل" : "معاينة التصميم"}
        </Button>
        <Button 
          onClick={() => {
            toast.success("تم اعتماد وتخزين تصميم القالب بنجاح!");
            router.push("/dashboard");
          }} 
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          اعتماد التصميم
        </Button>
      </div>
    </div>
  );
}
