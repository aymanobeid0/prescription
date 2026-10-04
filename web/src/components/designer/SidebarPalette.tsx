"use client";

import { useDesignerStore } from "@/store/useDesignerStore";
import { ELEMENT_CAT } from "@/lib/designer-elements";
import { ElementType } from "@/types/designer";

export default function SidebarPalette() {
  const { docType } = useDesignerStore();

  const handleDragStart = (e: React.DragEvent, key: ElementType) => {
    e.dataTransfer.setData("text/plain", key);
    e.dataTransfer.effectAllowed = "copy";
  };

  const allowedGroups = docType === "rx" 
    ? ["clinic", "patient", "rx", "general"] 
    : ["clinic", "patient", "invoice", "general"];

  // Group items
  const groups: Record<string, typeof ELEMENT_CAT[ElementType][]> = {
    clinic: [],
    patient: [],
    rx: [],
    invoice: [],
    general: [],
  };

  Object.values(ELEMENT_CAT).forEach((item) => {
    if (allowedGroups.includes(item.group)) {
      groups[item.group].push(item);
    }
  });

  const groupNames: Record<string, string> = {
    clinic: "بيانات العيادة",
    patient: "بيانات المريض",
    rx: "الوصفة",
    invoice: "الفاتورة",
    general: "عناصر حرة",
  };

  return (
    <div className="p-4 flex flex-col gap-4 overflow-y-auto">
      <div className="text-xs text-slate-500 mb-2">
        اسحب العنصر إلى الورقة لإضافته.
      </div>
      {allowedGroups.map((group) => (
        <div key={group} className="mb-4">
          <h3 className="text-xs font-bold text-slate-400 mb-2">{groupNames[group]}</h3>
          <div className="flex flex-col gap-2">
            {groups[group].map((item) => (
              <div
                key={item.key}
                draggable
                onDragStart={(e) => handleDragStart(e, item.key)}
                className="flex items-center gap-3 w-full p-2 border border-slate-200 rounded-md bg-white cursor-grab hover:bg-sky-50 hover:border-sky-500 hover:text-sky-700 transition-colors select-none"
              >
                <span className="w-5 text-center text-sky-600 font-bold">{item.ic}</span>
                <span className="text-sm flex-1">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
