"use client";

import { AppState } from "@/types/designer";
import { ELEMENT_CAT } from "@/lib/designer-elements";

interface Props {
  doc: AppState["docs"]["rx"] | AppState["docs"]["invoice"];
}

export default function DocumentViewer({ doc }: Props) {
  const isA4 = doc.paper === "A4";
  const paperClass = isA4 ? "w-[210mm] h-[297mm]" : "w-[148mm] h-[210mm]";

  return (
    <div className="flex justify-center my-8 print:my-0 print:w-full print:h-full">
      <div 
        className={`relative bg-white shadow-md print:shadow-none print:border-none border border-slate-200 overflow-hidden ${paperClass}`}
      >
        {doc.els.map((el) => (
          <div
            key={el.id}
            className="absolute overflow-hidden"
            style={{
              left: `${el.x}mm`,
              top: `${el.y}mm`,
              width: `${el.w}mm`,
              height: `${el.h}mm`,
              backgroundColor: el.style.bg,
              border: `${el.style.bw}px ${el.style.dash ? "dashed" : "solid"} ${el.style.bc}`,
              borderRadius: `${el.style.radius}mm`,
              fontSize: `${el.style.fs}pt`,
              color: elementColor(el.style.color),
              textAlign: el.style.align as any,
            }}
          >
            <div className="w-full h-full p-1 flex flex-col justify-center">
              {el.type === "rxTable" || el.type === "invTable" ? (
                <table className="w-full border-collapse border border-slate-400 text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      {(el.cols || ELEMENT_CAT[el.key]?.cols || []).map(col => (
                        <th key={col} className="border border-slate-400 p-1 text-center font-bold">
                          {col === 'i' ? 'م' : 
                           col === 'name' ? 'الوصف / الاسم' : 
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
                    {/* For now we just render the raw text if any, or empty rows. Later we can parse JSON rows */}
                    <tr>
                      <td colSpan={(el.cols || ELEMENT_CAT[el.key]?.cols || []).length} className="border border-slate-400 p-2 whitespace-pre-wrap text-center text-slate-500">
                        {el.text ? el.text : "لم يتم إدخال بيانات"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                el.text ?? ELEMENT_CAT[el.key]?.label ?? el.key
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function elementColor(c: string) {
  return c;
}
