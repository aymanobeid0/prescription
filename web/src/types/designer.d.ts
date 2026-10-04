export type ElementType = 
  | "logo"
  | "clinicName"
  | "doctorName"
  | "specialty"
  | "clinicPhone"
  | "clinicAddress"
  | "license"
  | "workingHours"
  | "patientName"
  | "patientPhone"
  | "patientAge"
  | "patientGender"
  | "fileNo"
  | "docDate"
  | "rxSymbol"
  | "diagnosis"
  | "rxTable"
  | "rxNotes"
  | "nextVisit"
  | "invoiceNo"
  | "invTable"
  | "totals"
  | "paymentMethod"
  | "paidStatus"
  | "invoiceNote"
  | "title"
  | "text"
  | "hline"
  | "vline"
  | "rect"
  | "image"
  | "signature"
  | "stamp"
  | "qr";

export interface ElementStyle {
  fs: number; // font-size
  bold: boolean;
  italic: boolean;
  color: string;
  align: "left" | "center" | "right";
  valign: "start" | "center" | "end";
  lh: number; // line-height
  bg: string;
  bw: number; // border-width
  bc: string; // border-color
  radius: number;
  pad: number;
  headBg: string;
  tbc: string;
  lblColor: string;
  dash: boolean;
  fit: "contain" | "cover" | "fill";
}

export interface DesignerElement {
  id: string;
  key: ElementType;
  type: "field" | "text" | "hline" | "vline" | "rect" | "image" | "signature" | "stamp" | "qr" | "rxSymbol" | "rxTable" | "invTable" | "totals" | "logo";
  x: number; // in mm
  y: number; // in mm
  w: number; // in mm
  h: number; // in mm
  locked: boolean;
  style: ElementStyle;
  showLabel?: boolean;
  text?: string;
  src?: string;
  cols?: string[];
}

export type PaperSize = "A4" | "A5";
export type DocType = "rx" | "invoice";

export interface DocTemplate {
  paper: PaperSize;
  lang?: "ar" | "fr";
  font: string;
  els: DesignerElement[];
}

export interface AppState {
  docType: DocType;
  sample: "short" | "long";
  currency: string;
  docs: {
    rx: DocTemplate;
    invoice: DocTemplate;
  };
}
