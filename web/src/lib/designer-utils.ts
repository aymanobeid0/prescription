import { ElementStyle, PaperSize } from "@/types/designer";

export const PX = 96 / 25.4; // pixels per mm
export const SAFE = 6; // safe margin in mm

export const PAPERS: Record<PaperSize, { w: number; h: number }> = {
  A4: { w: 210, h: 297 },
  A5: { w: 148, h: 210 },
};

export const BASE_STYLE: ElementStyle = {
  fs: 10,
  bold: false,
  italic: false,
  color: "#1f2a33",
  align: "right",
  valign: "center",
  lh: 1.35,
  bg: "transparent",
  bw: 0,
  bc: "#1f2a33",
  radius: 0,
  pad: 0.8,
  headBg: "#e8f3f7",
  tbc: "#cfd8de",
  lblColor: "#1f2a33",
  dash: false,
  fit: "contain",
};

// Generate random unique ID
export const generateId = () => Math.random().toString(36).slice(2, 10);
