"use client";

import { useDesignerStore } from "@/store/useDesignerStore";
import { ELEMENT_CAT } from "@/lib/designer-elements";
import { PAPERS } from "@/lib/designer-utils";
import { TABLE_COLUMNS } from "@/lib/table-utils";

export default function PropertiesPanel() {
  const { selectedId, docs, docType, updateElement, removeElement, setPaperSize } = useDesignerStore();
  const currentDoc = docs[docType];
  const selectedEl = currentDoc.els.find((e) => e.id === selectedId);

  if (!selectedEl) {
    return (
      <div className="p-6 text-sm text-slate-500 text-center mt-10">
        <p className="mb-4">حدد عنصراً من الورقة لتعديل خصائصه</p>
        <div className="border-t pt-4 text-right">
          <h4 className="font-bold mb-2">إعدادات الورقة</h4>
          <label className="flex items-center gap-2 mb-2">
            <span>مقاس الورق:</span>
            <select 
              className="border rounded p-1"
              value={currentDoc.paper}
              onChange={(e) => setPaperSize(e.target.value as any)}
            >
              <option value="A4">A4</option>
              <option value="A5">A5</option>
            </select>
          </label>
        </div>
      </div>
    );
  }

  const cat = ELEMENT_CAT[selectedEl.key];

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="font-bold text-sky-800">{cat.label}</h3>
        <button 
          onClick={() => removeElement(selectedEl.id)}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          حذف
        </button>
      </div>

      <div className="flex flex-col gap-3 text-sm">
        <label className="flex flex-col gap-1">
          <span className="text-slate-600">العرض (mm)</span>
          <input 
            type="number" 
            value={Math.round(selectedEl.w)}
            onChange={(e) => updateElement(selectedEl.id, { w: Number(e.target.value) })}
            className="border p-1 rounded"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-slate-600">الارتفاع (mm)</span>
          <input 
            type="number" 
            value={Math.round(selectedEl.h)}
            onChange={(e) => updateElement(selectedEl.id, { h: Number(e.target.value) })}
            className="border p-1 rounded"
          />
        </label>

        <label className="flex flex-col gap-1 mt-2 border-t pt-2">
          <span className="text-slate-600 font-bold">محتوى النص / القالب</span>
          <textarea 
            value={selectedEl.text ?? cat.label}
            onChange={(e) => updateElement(selectedEl.id, { text: e.target.value })}
            className="border p-2 rounded min-h-[60px]"
            placeholder="اكتب المحتوى هنا..."
          />
        </label>
        
        <div className="border-t pt-2 mt-2">
          <h4 className="font-bold text-slate-700 mb-2">محاذاة العنصر في الورقة</h4>
          <div className="flex bg-slate-100 rounded border">
            <button 
              onClick={() => updateElement(selectedEl.id, { x: PAPERS[currentDoc.paper].w - selectedEl.w })}
              className="flex-1 py-1 text-sm border-l hover:bg-slate-200"
            >يمين</button>
            <button 
              onClick={() => updateElement(selectedEl.id, { x: (PAPERS[currentDoc.paper].w - selectedEl.w) / 2 })}
              className="flex-1 py-1 text-sm border-l hover:bg-slate-200"
            >منتصف</button>
            <button 
              onClick={() => updateElement(selectedEl.id, { x: 0 })}
              className="flex-1 py-1 text-sm hover:bg-slate-200"
            >يسار</button>
          </div>
        </div>

        {(cat.type === "rxTable" || cat.type === "invTable") && (
          <div className="border-t pt-2 mt-2">
            <h4 className="font-bold text-slate-700 mb-2">أعمدة الجدول</h4>
            <div className="flex flex-col gap-2">
              {(cat.cols || []).map((k) => {
                const isSelected = (selectedEl.cols || cat.cols || []).includes(k);
                return (
                  <label key={k} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      onChange={(e) => {
                        let newCols = selectedEl.cols || cat.cols || [];
                        if (e.target.checked) {
                          if (!newCols.includes(k)) {
                            // insert in original order
                            newCols = (cat.cols || []).filter(c => newCols.includes(c) || c === k);
                          }
                        } else {
                          newCols = newCols.filter(c => c !== k);
                        }
                        updateElement(selectedEl.id, { cols: newCols });
                      }}
                      className="accent-sky-600"
                    />
                    <span className="text-slate-600 text-sm">{TABLE_COLUMNS[k] || k}</span>
                  </label>
                )
              })}
            </div>
          </div>
        )}

        <div className="border-t pt-2 mt-2">
          <h4 className="font-bold text-slate-700 mb-2">الخط والتنسيق</h4>
          
          <div className="flex flex-col gap-2 mb-2">
            <span className="text-slate-600">محاذاة النص داخل العنصر</span>
            <div className="flex bg-slate-100 rounded border">
              <button 
                onClick={() => updateElement(selectedEl.id, { style: { ...selectedEl.style, align: "right" } })}
                className={`flex-1 py-1 text-sm border-l hover:bg-slate-200 ${selectedEl.style.align === "right" ? "bg-sky-200 font-bold" : ""}`}
              >يمين</button>
              <button 
                onClick={() => updateElement(selectedEl.id, { style: { ...selectedEl.style, align: "center" } })}
                className={`flex-1 py-1 text-sm border-l hover:bg-slate-200 ${selectedEl.style.align === "center" ? "bg-sky-200 font-bold" : ""}`}
              >توسيط</button>
              <button 
                onClick={() => updateElement(selectedEl.id, { style: { ...selectedEl.style, align: "left" } })}
                className={`flex-1 py-1 text-sm hover:bg-slate-200 ${selectedEl.style.align === "left" ? "bg-sky-200 font-bold" : ""}`}
              >يسار</button>
            </div>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-slate-600">حجم الخط</span>
            <input 
              type="number" 
              value={selectedEl.style.fs}
              onChange={(e) => updateElement(selectedEl.id, { style: { ...selectedEl.style, fs: Number(e.target.value) } })}
              className="border p-1 rounded"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
