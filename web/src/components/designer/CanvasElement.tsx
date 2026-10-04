"use client";

import { DesignerElement } from "@/types/designer";
import { useDesignerStore } from "@/store/useDesignerStore";
import { PX, SAFE } from "@/lib/designer-utils";
import { ELEMENT_CAT } from "@/lib/designer-elements";
import React, { useRef, useEffect } from "react";

interface Props {
  element: DesignerElement;
}

export default function CanvasElement({ element }: Props) {
  const { selectedId, selectElement, updateElement, zoom, docs, docType } = useDesignerStore();
  const isSelected = selectedId === element.id;
  const paper = docs[docType].paper === "A4" ? { w: 210, h: 297 } : { w: 148, h: 210 };
  
  const ref = useRef<HTMLDivElement>(null);
  const dragInfo = useRef({ isDragging: false, startX: 0, startY: 0, initX: 0, initY: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    selectElement(element.id);

    if (element.locked) return;

    const target = e.target as HTMLElement;
    if (target.isContentEditable) return; // Don't drag if editing text

    dragInfo.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      initX: element.x,
      initY: element.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragInfo.current.isDragging) return;

    const dx = (e.clientX - dragInfo.current.startX) / (PX * zoom);
    const dy = (e.clientY - dragInfo.current.startY) / (PX * zoom);

    let newX = dragInfo.current.initX + dx;
    let newY = dragInfo.current.initY + dy;

    // Boundary check
    newX = Math.max(0, Math.min(newX, paper.w - element.w));
    newY = Math.max(0, Math.min(newY, paper.h - element.h));

    if (ref.current) {
      ref.current.style.left = `${newX}mm`;
      ref.current.style.top = `${newY}mm`;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragInfo.current.isDragging) {
      dragInfo.current.isDragging = false;
      
      // Save final position to store
      if (ref.current) {
        const finalX = parseFloat(ref.current.style.left) || element.x;
        const finalY = parseFloat(ref.current.style.top) || element.y;
        updateElement(element.id, { x: finalX, y: finalY });
      }
    }
  };

  const handleResize = (e: React.PointerEvent, dir: string) => {
    e.stopPropagation();
    if (element.locked) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const initX = element.x;
    const initY = element.y;
    const initW = element.w;
    const initH = element.h;

    const onMove = (moveEvent: PointerEvent) => {
      const dx = (moveEvent.clientX - startX) / (PX * zoom);
      const dy = (moveEvent.clientY - startY) / (PX * zoom);

      let newX = initX;
      let newY = initY;
      let newW = initW;
      let newH = initH;

      if (dir.includes("e")) newW = Math.max(5, initW + dx);
      if (dir.includes("s")) newH = Math.max(5, initH + dy);
      if (dir.includes("w")) {
        const diff = Math.min(dx, initW - 5);
        newX = initX + diff;
        newW = initW - diff;
      }
      if (dir.includes("n")) {
        const diff = Math.min(dy, initH - 5);
        newY = initY + diff;
        newH = initH - diff;
      }

      if (ref.current) {
        ref.current.style.left = `${newX}mm`;
        ref.current.style.top = `${newY}mm`;
        ref.current.style.width = `${newW}mm`;
        ref.current.style.height = `${newH}mm`;
      }
    };

    const onUp = (upEvent: PointerEvent) => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      
      if (ref.current) {
        updateElement(element.id, {
          x: parseFloat(ref.current.style.left) || element.x,
          y: parseFloat(ref.current.style.top) || element.y,
          w: parseFloat(ref.current.style.width) || element.w,
          h: parseFloat(ref.current.style.height) || element.h,
        });
      }
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const handles = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];

  return (
    <div
      ref={ref}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`absolute overflow-visible ${isSelected ? "z-50" : "z-10 hover:outline hover:outline-1 hover:outline-sky-300"}`}
      style={{
        left: `${element.x}mm`,
        top: `${element.y}mm`,
        width: `${element.w}mm`,
        height: `${element.h}mm`,
      }}
    >
      <div 
        className={`w-full h-full relative cursor-move overflow-hidden ${isSelected ? "outline outline-2 outline-sky-500" : ""}`}
        style={{
          backgroundColor: element.style.bg,
          border: `${element.style.bw}px ${element.style.dash ? "dashed" : "solid"} ${element.style.bc}`,
          borderRadius: `${element.style.radius}mm`,
          fontSize: `${element.style.fs}pt`,
          color: element.style.color,
          textAlign: element.style.align,
        }}
      >
        <div 
          className="w-full h-full p-1 outline-none flex flex-col justify-center"
          contentEditable={isSelected && !element.locked}
          suppressContentEditableWarning
          onBlur={(e) => updateElement(element.id, { text: e.currentTarget.innerText })}
          onPointerDown={(e) => {
            if (isSelected) e.stopPropagation();
          }}
          style={{ cursor: isSelected ? "text" : "move" }}
        >
          {element.type === "rxTable" || element.type === "invTable" ? (
            <table className="w-full border-collapse border border-slate-300 text-sm">
              <thead className="bg-slate-100">
                <tr>
                  {(element.cols || ELEMENT_CAT[element.key]?.cols || []).map(col => (
                    <th key={col} className="border border-slate-300 p-1 text-center font-bold">
                      {/* Need to import TABLE_COLUMNS but wait, I can just require it or put it inline if I don't import yet */}
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
                <tr>
                  {(element.cols || ELEMENT_CAT[element.key]?.cols || []).map(col => (
                    <td key={col} className="border border-slate-300 p-1 h-6"></td>
                  ))}
                </tr>
                <tr>
                  {(element.cols || ELEMENT_CAT[element.key]?.cols || []).map(col => (
                    <td key={col} className="border border-slate-300 p-1 h-6"></td>
                  ))}
                </tr>
              </tbody>
            </table>
          ) : (
            element.text ?? ELEMENT_CAT[element.key]?.label ?? element.key
          )}
        </div>
      </div>
      
      {isSelected && !element.locked && handles.map((h) => (
        <div
          key={h}
          onPointerDown={(e) => handleResize(e, h)}
          className="absolute bg-white border border-sky-500"
          style={{
            width: "8px",
            height: "8px",
            ...getHandleStyle(h)
          }}
        />
      ))}
    </div>
  );
}

function getHandleStyle(dir: string): React.CSSProperties {
  const style: React.CSSProperties = { cursor: `${dir}-resize` };
  if (dir.includes("n")) style.top = "-4px";
  if (dir.includes("s")) style.bottom = "-4px";
  if (dir.includes("w")) style.left = "-4px";
  if (dir.includes("e")) style.right = "-4px";
  if (dir === "n" || dir === "s") style.left = "calc(50% - 4px)";
  if (dir === "w" || dir === "e") style.top = "calc(50% - 4px)";
  return style;
}
