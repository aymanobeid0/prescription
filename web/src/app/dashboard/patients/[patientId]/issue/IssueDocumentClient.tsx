"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useDesignerStore } from "@/store/useDesignerStore";
import { createDocumentRecord } from "./actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import EditableDocumentViewer from "@/components/designer/EditableDocumentViewer";

export default function IssueDocumentClient({ patient, profile }: { patient: any, profile: any }) {
  const [docType, setDocType] = useState<"rx" | "invoice">("rx");
  const [loading, setLoading] = useState(false);
  const { docs } = useDesignerStore();
  const router = useRouter();

  // Local state for the document being edited
  const [currentDoc, setCurrentDoc] = useState<any>(null);

  // Initialize the document when docType changes
  useEffect(() => {
    const template = docs[docType];
    const finalElements = template.els.map(el => {
      let injectedText = el.text || "";
      
      // Auto-inject patient/clinic data
      if (el.key === "patientName") injectedText = patient.full_name;
      if (el.key === "patientAge") injectedText = patient.age ? patient.age.toString() : "";
      if (el.key === "patientPhone") injectedText = patient.phone || "";
      if (el.key === "fileNo") injectedText = patient.file_no || "";
      if (el.key === "clinicName") injectedText = profile.clinic_name || "";
      if (el.key === "doctorName") injectedText = profile.doctor_name || "";
      if (el.key === "clinicPhone") injectedText = profile.phone || "";
      if (el.key === "specialty") injectedText = profile.specialty || "";
      if (el.key === "docDate") injectedText = new Date().toLocaleDateString("ar-SA");
      
      return { ...el, text: injectedText };
    });

    setCurrentDoc({ ...template, els: finalElements });
  }, [docType, docs, patient, profile]);

  const handleIssue = async () => {
    if (!currentDoc) return;
    setLoading(true);
    
    // Save to DB
    const res = await createDocumentRecord(patient.id, docType, currentDoc);
    
    if (res.error) {
      toast.error(res.error);
      setLoading(false);
    } else if (res.docId) {
      toast.success("تم الإصدار بنجاح");
      router.push(`/dashboard/documents/${res.docId}`);
    }
  };

  if (!currentDoc) return <div className="p-8 text-center text-slate-500">جاري تحميل القالب...</div>;

  return (
    <div className="flex flex-col min-h-screen pb-12 bg-slate-50">
      {/* Top Navbar */}
      <div className="bg-white border-b px-8 py-4 flex flex-col md:flex-row md:items-center justify-between shadow-sm sticky top-0 z-50 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">إصدار مستند جديد</h1>
          <p className="text-slate-500 mt-1">المريض: {patient.full_name}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border-r pr-4 mr-2">
            <span className="text-sm font-medium text-slate-700">الورق:</span>
            <select 
              value={currentDoc?.paper || "A4"} 
              onChange={(e) => setCurrentDoc({...currentDoc, paper: e.target.value as "A4"|"A5"})}
              className="text-sm border border-slate-300 rounded px-2 py-1 outline-none bg-slate-50 focus:ring-1 focus:ring-sky-500"
            >
              <option value="A4">A4 (كبير)</option>
              <option value="A5">A5 (صغير)</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2 border-r pr-4 mr-2">
            <span className="text-sm font-medium text-slate-700">اللغة:</span>
            <select 
              value={currentDoc?.lang || "ar"} 
              onChange={(e) => setCurrentDoc({...currentDoc, lang: e.target.value as "ar"|"fr"})}
              className="text-sm border border-slate-300 rounded px-2 py-1 outline-none bg-slate-50 focus:ring-1 focus:ring-sky-500"
            >
              <option value="ar">عربي</option>
              <option value="fr">فرنسي</option>
            </select>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-md border border-slate-200">
            <button
              onClick={() => setDocType("rx")}
              className={`px-4 py-1.5 rounded text-sm transition-colors ${docType === "rx" ? "bg-white shadow-sm font-bold text-sky-700" : "text-slate-500 hover:text-slate-700"}`}
            >
              وصفة طبية
            </button>
            <button
              onClick={() => setDocType("invoice")}
              className={`px-4 py-1.5 rounded text-sm transition-colors ${docType === "invoice" ? "bg-white shadow-sm font-bold text-sky-700" : "text-slate-500 hover:text-slate-700"}`}
            >
              فاتورة
            </button>
          </div>
          <Button onClick={handleIssue} disabled={loading} className="bg-sky-600 hover:bg-sky-700 px-6 shadow-md">
            {loading ? "جاري الإصدار..." : "إصدار وحفظ المستند"}
          </Button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex justify-center w-full bg-white min-h-[297mm]">
        <EditableDocumentViewer 
          doc={currentDoc} 
          onChange={setCurrentDoc} 
          originalPaper={docs[docType].paper}
        />
      </div>
    </div>
  );
}
