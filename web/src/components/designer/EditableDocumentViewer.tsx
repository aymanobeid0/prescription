"use client";

import { AppState, DesignerElement } from "@/types/designer";
import { ELEMENT_CAT } from "@/lib/designer-elements";
import React from "react";

interface Props {
  doc: AppState["docs"]["rx"] | AppState["docs"]["invoice"];
  onChange: (newDoc: AppState["docs"]["rx"] | AppState["docs"]["invoice"]) => void;
  originalPaper?: "A4" | "A5";
}

export default function EditableDocumentViewer({ doc, onChange, originalPaper = "A4" }: Props) {

  const updateElementText = (id: string, text: string) => {
    const newEls = doc.els.map((el) => el.id === id ? { ...el, text } : el);
    onChange({ ...doc, els: newEls });
  };

  const handleTableDataChange = (id: string, rowIndex: number, colKey: string, val: string) => {
    const el = doc.els.find(e => e.id === id);
    if (!el) return;
    
    // We will store table data as a JSON string in el.text for now
    let data: any[] = [];
    try {
      if (el.text && el.text.startsWith("[")) {
        data = JSON.parse(el.text);
      }
    } catch(e) {}

    // Ensure row exists
    while(data.length <= rowIndex) {
      data.push({});
    }
    
    data[rowIndex][colKey] = val;
    updateElementText(id, JSON.stringify(data));
  };

  const addTableRow = (id: string) => {
    const el = doc.els.find(e => e.id === id);
    if (!el) return;
    let data: any[] = [];
    try {
      if (el.text && el.text.startsWith("[")) data = JSON.parse(el.text);
    } catch(e) {}
    data.push({});
    updateElementText(id, JSON.stringify(data));
  };

  const getTableData = (text?: string) => {
    try {
      if (text && text.startsWith("[")) return JSON.parse(text) as any[];
    } catch(e) {}
    return [{}]; // default 1 empty row
  };

  const isA4 = doc.paper === "A4";
  const paperClass = isA4 ? "max-w-[210mm] min-h-[297mm]" : "max-w-[148mm] min-h-[210mm]";

  return (
    <div className="flex justify-center w-full min-h-screen pt-12 pb-24 bg-white">
      <div 
        className={`relative w-full ${paperClass} mx-auto border border-solid border-black p-2 print:border-none print:p-0`}
      >
        {doc.els.map((el) => {
          // Identify editable fields
          const isEditable = [
            "diagnosis", "rxNotes", "nextVisit", "invoiceNote", "paymentMethod", "paidStatus", "text"
          ].includes(el.key);

          const isTable = el.type === "rxTable" || el.type === "invTable";

          const origWidth = originalPaper === "A4" ? 210 : 148;
          const lang = doc.lang || "ar";

          // Calculate left/right based on language
          let positioning = {};
          if (lang === "ar") {
            // Anchor to the right edge based on the original width
            const distanceFromRight = origWidth - el.x - el.w;
            positioning = { right: `${distanceFromRight}mm` };
          } else {
            // Anchor to the left edge
            positioning = { left: `${el.x}mm` };
          }

          return (
            <div
              key={el.id}
              className={`absolute overflow-visible ${isEditable || isTable ? "hover:outline hover:outline-1 hover:outline-sky-300" : ""}`}
              style={{
                ...positioning,
                top: `${el.y}mm`,
                width: `${el.w}mm`,
                height: `${el.h}mm`,
                backgroundColor: el.style.bg,
                border: `${el.style.bw}px ${el.style.dash ? "dashed" : "solid"} ${el.style.bc}`,
                borderRadius: `${el.style.radius}mm`,
                fontSize: `${el.style.fs}pt`,
                color: el.style.color,
                textAlign: el.style.align as any,
              }}
            >
              <div className="w-full h-full p-1 flex flex-col justify-center">
                {isTable ? (
                  <div className="w-full h-full relative group">
                    <table className="w-full border-collapse border border-slate-400 text-sm table-fixed">
                      <thead className="bg-slate-100">
                        <tr>
                          {(el.cols || ELEMENT_CAT[el.key]?.cols || []).map(col => (
                            <th key={col} className="border border-slate-400 p-1 text-center font-bold overflow-hidden text-ellipsis whitespace-nowrap">
                              {col === 'i' ? 'م' : 
                               col === 'name' ? 'الوصف' : 
                               col === 'dose' ? 'الجرعة' : 
                               col === 'freq' ? 'التكرار' : 
                               col === 'dur' ? 'المدة' : 
                               col === 'tooth' ? 'السن' : 
                               col === 'qty' ? 'الكمية' : 
                               col === 'price' ? 'السعر' : 
                               col === 'total' ? 'الإجمالي' : 
                               col === 'notes' ? 'ملاحظات' : col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {getTableData(el.text).map((row, rIdx) => (
                          <tr key={rIdx}>
                            {(el.cols || ELEMENT_CAT[el.key]?.cols || []).map(col => (
                              <td key={col} className="border border-slate-400 p-0 text-center relative h-6">
                                <input
                                  type="text"
                                  className="absolute inset-0 w-full h-full text-center bg-transparent outline-none focus:bg-sky-50"
                                  value={row[col] || ""}
                                  onChange={(e) => handleTableDataChange(el.id, rIdx, col, e.target.value)}
                                  placeholder={rIdx === 0 ? "..." : ""}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {/* Add row button (only visible on hover, hidden in print) */}
                    <button 
                      onClick={() => addTableRow(el.id)}
                      className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-sky-100 text-sky-700 text-xs px-2 py-1 rounded shadow hidden group-hover:block print:hidden"
                    >
                      + سطر جديد
                    </button>
                  </div>
                ) : (
                  <div 
                    className="w-full h-full outline-none focus:ring-1 focus:ring-sky-400 rounded transition-colors"
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      if (isEditable) {
                        updateElementText(el.id, e.currentTarget.innerText);
                      }
                    }}
                    dangerouslySetInnerHTML={{ __html: el.text ?? (ELEMENT_CAT[el.key]?.label ?? el.key) }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
