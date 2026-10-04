"use client";

import { useDesignerStore } from "@/store/useDesignerStore";
import { ELEMENT_CAT } from "@/lib/designer-elements";
import { generateId, PAPERS, PX, SAFE } from "@/lib/designer-utils";
import { ElementType } from "@/types/designer";
import { useState } from "react";
import CanvasElement from "./CanvasElement";

export default function CanvasArea() {
  const { docType, docs, zoom, addElement, selectElement } = useDesignerStore();
  const currentDoc = docs[docType];
  const paper = PAPERS[currentDoc.paper];

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const key = e.dataTransfer.getData("text/plain") as ElementType;
    if (!ELEMENT_CAT[key]) return;

    // Very simple drop calculation for now
    const rect = e.currentTarget.getBoundingClientRect();
    const k = PX * zoom;
    const cx = (e.clientX - rect.left) / k;
    const cy = (e.clientY - rect.top) / k;

    const cat = ELEMENT_CAT[key];
    
    // Add logic later for element creation, for now just basic insertion
    addElement({
      id: generateId(),
      key,
      type: cat.type as any,
      x: cx - cat.w / 2,
      y: cy - cat.h / 2,
      w: cat.w,
      h: cat.h,
      locked: false,
      style: {
        fs: 10, bold: false, italic: false, color: "#1f2a33", align: "right", valign: "center", lh: 1.35, bg: "transparent", bw: 0, bc: "#1f2a33", radius: 0, pad: 0.8, headBg: "#e8f3f7", tbc: "#cfd8de", lblColor: "#1f2a33", dash: false, fit: "contain",
        ...(cat.style || {})
      },
      showLabel: cat.showLabel,
      text: cat.text,
      cols: cat.cols,
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  return (
    <div className="w-full h-full flex p-10 overflow-auto bg-slate-100 items-center justify-center relative">
      {/* Tools top bar placeholder */}
      
      {/* Paper container */}
      <div 
        className="bg-white shadow-xl relative"
        style={{
          width: `${paper.w}mm`,
          height: `${paper.h}mm`,
          transform: `scale(${zoom})`,
          transformOrigin: "center center",
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onPointerDown={() => selectElement(null)}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(to right, rgba(0,0,0,.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,.045) 1px, transparent 1px)", backgroundSize: "5mm 5mm" }}></div>
        <div className="absolute border border-dashed border-red-300 pointer-events-none" style={{ left: `${SAFE}mm`, top: `${SAFE}mm`, right: `${SAFE}mm`, bottom: `${SAFE}mm` }}></div>
        
        {currentDoc.els.map((el) => (
          <CanvasElement key={el.id} element={el} />
        ))}
      </div>
    </div>
  );
}
