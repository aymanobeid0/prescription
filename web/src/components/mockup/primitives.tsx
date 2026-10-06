"use client";
import { Dialog } from "@base-ui/react/dialog";
import { X, TriangleAlert, Search, Inbox, CalendarDays, Clock3 } from "lucide-react";
import { Children, cloneElement, isValidElement, useId, useRef, type ReactNode, type ButtonHTMLAttributes, type InputHTMLAttributes } from "react";
import type { Locale, Patient } from "./data";
import type { Label, Translate } from "./labels";

export function Action({ children, variant = "secondary", className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" | "quiet"; children: ReactNode }) {
  return <button type="button" className={`mk-button mk-${variant} ${className}`} {...props}>{children}</button>;
}
export function Status({ status, t }: { status: Label; t: Translate }) {
  return <span className={`mk-status mk-status-${status}`}><span aria-hidden="true" />{t(status)}</span>;
}
export function Avatar({ name, large = false }: { name: string; large?: boolean }) {
  return <span aria-hidden="true" className={`mk-avatar ${large ? "mk-avatar-large" : ""}`}>{name.split(" ").slice(0, 2).map(s => s[0]).join(" ")}</span>;
}
export function PatientIdentity({ patient, locale }: { patient: Patient; locale: Locale }) {
  return <div className="mk-identity"><Avatar name={patient.name[locale]} /><div><strong>{patient.name[locale]}</strong><bdi className="mk-meta">{patient.phone}</bdi></div></div>;
}
export function Alert({ patient, locale, t }: { patient: Patient; locale: Locale; t: Translate }) {
  return <div className={patient.alert ? "mk-alert" : "mk-muted-line"}><TriangleAlert /><div>{patient.alert && <strong>{t("medicalAlert")}</strong>}<p>{patient.alert?.[locale] || t("noAlerts")}</p></div></div>;
}
export function Empty({ text }: { text: string }) { return <div className="mk-empty"><Inbox /><p>{text}</p></div>; }
export function SearchField({ value, onChange, t, label }: { value: string; onChange: (value: string) => void; t: Translate; label?: string }) {
  return <label className="mk-search"><Search /><input type="search" aria-label={label || t("search")} placeholder={t("search")} value={value} onChange={e => onChange(e.target.value)} /></label>;
}
export function Field({ label, children, wide = false }: { label: string; children: ReactNode; wide?: boolean }) {
  const labelId = useId();
  const associate = (nodes: ReactNode): ReactNode => Children.map(nodes, node => {
    if (!isValidElement<{ children?: ReactNode; "aria-labelledby"?: string }>(node) || typeof node.type !== "string") return node;
    if (["input", "select", "textarea"].includes(node.type)) return cloneElement(node, { "aria-labelledby": labelId });
    return node.props.children ? cloneElement(node, {}, associate(node.props.children)) : node;
  });
  return <label className={`mk-field ${wide ? "mk-field-wide" : ""}`}><span id={labelId}>{label}</span>{associate(children)}</label>;
}
export function PickerInput({ type, label, pickerLabel, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { type: "date" | "time"; label: string; pickerLabel: string }) {
  const input = useRef<HTMLInputElement>(null);
  const Icon = type === "date" ? CalendarDays : Clock3;
  return <div className="mk-input-icon mk-picker-input">
    <button type="button" className="mk-picker-button" aria-label={`${pickerLabel}: ${label}`} onClick={event => {
      event.preventDefault();
      const field = input.current;
      if (!field) return;
      field.focus();
      try { field.showPicker?.(); } catch { /* Text/keyboard editing remains available if the browser blocks its picker. */ }
    }}><Icon aria-hidden="true" /></button>
    <input {...props} ref={input} type={type} aria-label={label} />
  </div>;
}
export function Modal({ title, children, onClose, locale, t, returnFocus, wide = false }: { title: string; children: ReactNode; onClose: () => void; locale: Locale; t: Translate; returnFocus: HTMLElement | null; wide?: boolean }) {
  return <Dialog.Root open onOpenChange={open => { if (!open) onClose(); }}><Dialog.Portal><Dialog.Backdrop className="mk-backdrop" /><Dialog.Popup className={`mk-dialog mk-scope ${wide ? "mk-dialog-wide" : ""}`} dir={locale === "ar" ? "rtl" : "ltr"} lang={locale} finalFocus={() => returnFocus?.isConnected ? returnFocus : document.querySelector<HTMLElement>(".mk-main h1") || true}>
    <div className="mk-dialog-header"><Dialog.Title>{title}</Dialog.Title><Dialog.Close className="mk-icon-button" aria-label={t("close")}><X /></Dialog.Close></div>{children}
  </Dialog.Popup></Dialog.Portal></Dialog.Root>;
}
export function Filter({ value, onChange, options, label }: { value: string; onChange: (value: string) => void; options: { value: string; label: string }[]; label: string }) {
  return <select className="mk-control" aria-label={label} value={value} onChange={e => onChange(e.target.value)}>{options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>;
}
