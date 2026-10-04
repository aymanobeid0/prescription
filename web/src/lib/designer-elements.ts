import { ElementType, ElementStyle } from "@/types/designer";

export interface PaletteItem {
  key: ElementType;
  group: "clinic" | "patient" | "rx" | "invoice" | "general";
  type: string;
  label: string;
  ic: string;
  w: number;
  h: number;
  style?: Partial<ElementStyle>;
  showLabel?: boolean;
  text?: string;
  cols?: string[];
}

export const ELEMENT_CAT: Record<ElementType, PaletteItem> = {
  logo: { key: "logo", group: "clinic", type: "logo", label: "الشعار", ic: "◎", w: 24, h: 24 },
  clinicName: { key: "clinicName", group: "clinic", type: "field", label: "اسم العيادة", ic: "T", w: 90, h: 10, style: { fs: 15, bold: true } },
  doctorName: { key: "doctorName", group: "clinic", type: "field", label: "اسم الطبيب", ic: "T", w: 80, h: 7, style: { fs: 11, bold: true } },
  specialty: { key: "specialty", group: "clinic", type: "field", label: "الاختصاص", ic: "T", w: 80, h: 6, style: { fs: 9, color: "#5b6670" } },
  clinicPhone: { key: "clinicPhone", group: "clinic", type: "field", label: "هاتف العيادة", ic: "☎", w: 60, h: 6, style: { fs: 9 } },
  clinicAddress: { key: "clinicAddress", group: "clinic", type: "field", label: "العنوان", ic: "⌂", w: 90, h: 6, style: { fs: 9 } },
  license: { key: "license", group: "clinic", type: "field", label: "رقم الترخيص", ic: "#", w: 50, h: 6, style: { fs: 8, color: "#5b6670" } },
  workingHours: { key: "workingHours", group: "clinic", type: "field", label: "أوقات الدوام", ic: "◷", w: 70, h: 6, style: { fs: 8 } },
  patientName: { key: "patientName", group: "patient", type: "field", label: "اسم المريض", ic: "👤", w: 70, h: 7, showLabel: true },
  patientPhone: { key: "patientPhone", group: "patient", type: "field", label: "رقم الموبايل", ic: "☎", w: 60, h: 7, showLabel: true },
  patientAge: { key: "patientAge", group: "patient", type: "field", label: "العمر", ic: "#", w: 35, h: 7, showLabel: true },
  patientGender: { key: "patientGender", group: "patient", type: "field", label: "الجنس", ic: "⚥", w: 35, h: 7, showLabel: true },
  fileNo: { key: "fileNo", group: "patient", type: "field", label: "رقم الملف", ic: "#", w: 45, h: 7, showLabel: true },
  docDate: { key: "docDate", group: "patient", type: "field", label: "التاريخ", ic: "▦", w: 45, h: 7, showLabel: true },
  rxSymbol: { key: "rxSymbol", group: "rx", type: "rxSymbol", label: "رمز ℞", ic: "℞", w: 16, h: 14, style: { fs: 28, bold: true, color: "#1f6f8b", align: "center", lh: 1, pad: 0 } },
  diagnosis: { key: "diagnosis", group: "rx", type: "field", label: "التشخيص", ic: "✚", w: 110, h: 7, showLabel: true },
  rxTable: { key: "rxTable", group: "rx", type: "rxTable", label: "جدول الأدوية", ic: "☰", w: 120, h: 55, cols: ["i", "name", "dose", "freq", "dur"], style: { fs: 9, valign: "start" } },
  rxNotes: { key: "rxNotes", group: "rx", type: "field", label: "تعليمات للمريض", ic: "✎", w: 120, h: 16, showLabel: true, style: { fs: 9, valign: "start" } },
  nextVisit: { key: "nextVisit", group: "rx", type: "field", label: "الزيارة القادمة", ic: "▦", w: 60, h: 7, showLabel: true },
  invoiceNo: { key: "invoiceNo", group: "invoice", type: "field", label: "رقم الفاتورة", ic: "#", w: 70, h: 7, showLabel: true },
  invTable: { key: "invTable", group: "invoice", type: "invTable", label: "جدول الإجراءات", ic: "☰", w: 180, h: 90, cols: ["i", "name", "tooth", "qty", "price", "total"], style: { fs: 10, valign: "start" } },
  totals: { key: "totals", group: "invoice", type: "totals", label: "المجاميع", ic: "Σ", w: 75, h: 38, style: { fs: 10, valign: "start" } },
  paymentMethod: { key: "paymentMethod", group: "invoice", type: "field", label: "طريقة الدفع", ic: "💳", w: 70, h: 7, showLabel: true },
  paidStatus: { key: "paidStatus", group: "invoice", type: "field", label: "حالة الدفع", ic: "✓", w: 70, h: 7, showLabel: true },
  invoiceNote: { key: "invoiceNote", group: "invoice", type: "field", label: "ملاحظة الفاتورة", ic: "✎", w: 120, h: 7 },
  title: { key: "title", group: "general", type: "text", label: "عنوان", ic: "H", w: 80, h: 11, text: "وصفة طبية", style: { fs: 18, bold: true, align: "center" } },
  text: { key: "text", group: "general", type: "text", label: "نص حر", ic: "¶", w: 60, h: 10, text: "نص قابل للتعديل" },
  hline: { key: "hline", group: "general", type: "hline", label: "خط أفقي", ic: "—", w: 100, h: 3, style: { bw: 1.5, bc: "#1f6f8b" } },
  vline: { key: "vline", group: "general", type: "vline", label: "خط عمودي", ic: "|", w: 3, h: 40, style: { bw: 1.5, bc: "#1f6f8b" } },
  rect: { key: "rect", group: "general", type: "rect", label: "إطار / خلفية", ic: "▭", w: 60, h: 30, style: { bw: 1, bc: "#9fb3c0", radius: 2 } },
  image: { key: "image", group: "general", type: "image", label: "صورة", ic: "▣", w: 40, h: 30 },
  signature: { key: "signature", group: "general", type: "signature", label: "التوقيع", ic: "✍", w: 50, h: 18, text: "توقيع الطبيب", style: { fs: 9, align: "center", valign: "end" } },
  stamp: { key: "stamp", group: "general", type: "stamp", label: "ختم العيادة", ic: "◯", w: 28, h: 28, text: "ختم العيادة", style: { fs: 8, align: "center", color: "#8a96a0" } },
  qr: { key: "qr", group: "general", type: "qr", label: "رمز QR", ic: "▩", w: 22, h: 22 }
};
