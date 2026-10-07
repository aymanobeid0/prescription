"use client";
import { Dialog } from "@base-ui/react/dialog";
import { Select } from "@base-ui/react/select";
import { DirectionProvider } from "@base-ui/react/direction-provider";
import { X, TriangleAlert, Search, Inbox, CalendarDays, Clock3, ChevronDown, Check } from "lucide-react";
import { useMockup } from "./context";
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
  return <div className={`mk-field ${wide ? "mk-field-wide" : ""}`}><span id={labelId}>{label}</span>{associate(children)}</div>;
}
export function PickerInput({ type, label, pickerLabel, wrapperClassName = "", ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { type: "date" | "time"; label: string; pickerLabel: string; wrapperClassName?: string }) {
  const input = useRef<HTMLInputElement>(null);
  const Icon = type === "date" ? CalendarDays : Clock3;
  const openPicker = () => {
    const field = input.current;
    if (!field || field.disabled || field.readOnly) return;
    field.focus();
    try { field.showPicker?.(); } catch { /* Keyboard editing remains available if the browser blocks its picker. */ }
  };
  return <div className={`mk-input-icon mk-picker-input ${wrapperClassName}`} onClick={event => { event.preventDefault(); openPicker(); }}>
    <button type="button" className="mk-picker-button" disabled={props.disabled} aria-label={`${pickerLabel}: ${label}`}><Icon aria-hidden="true" /></button>
    <input {...props} ref={input} type={type} aria-label={label} onKeyDown={event => {
      props.onKeyDown?.(event);
      if (!event.defaultPrevented && event.key === "Enter") { event.preventDefault(); openPicker(); }
    }} />
  </div>;
}
export function Modal({ title, children, onClose, locale, t, returnFocus, wide = false }: { title: string; children: ReactNode; onClose: () => void; locale: Locale; t: Translate; returnFocus: HTMLElement | null; wide?: boolean }) {
  return <Dialog.Root open onOpenChange={open => { if (!open) onClose(); }}><Dialog.Portal><Dialog.Backdrop className="mk-backdrop" /><Dialog.Popup className={`mk-dialog mk-scope ${wide ? "mk-dialog-wide" : ""}`} dir={locale === "ar" ? "rtl" : "ltr"} lang={locale} finalFocus={() => returnFocus?.isConnected ? returnFocus : document.querySelector<HTMLElement>(".mk-main h1") || true}>
    <div className="mk-dialog-header"><Dialog.Title>{title}</Dialog.Title><Dialog.Close className="mk-icon-button" aria-label={t("close")}><X /></Dialog.Close></div>{children}
  </Dialog.Popup></Dialog.Portal></Dialog.Root>;
}
export function Filter({ value, onChange, options, label, required = false, disabled = false, className = "", dir }: { value: string; onChange: (value: string) => void; options: { value: string; label: string }[]; label: string; required?: boolean; disabled?: boolean; className?: string; dir?: "ltr" | "rtl" }) {
  const { locale } = useMockup();
  const direction = dir || (locale === "ar" ? "rtl" : "ltr");
  return <DirectionProvider direction={direction}><Select.Root modal={false} value={value || null} items={options} required={required} disabled={disabled} onValueChange={next => onChange(next || "")}>
    <Select.Trigger className={`mk-control mk-select-trigger ${className}`} aria-label={label} dir={direction}><Select.Value placeholder={options.find(o => !o.value)?.label || label} /><Select.Icon><ChevronDown aria-hidden="true" /></Select.Icon></Select.Trigger>
    <Select.Portal><Select.Positioner className="mk-select-positioner" sideOffset={6} align="start" alignItemWithTrigger={false}><Select.Popup className="mk-scope mk-select-popup" dir={direction} lang={locale}><Select.List className="mk-select-list">{options.filter(o => o.value).map(o => <Select.Item className="mk-select-option" key={o.value} value={o.value}><Select.ItemText>{o.label}</Select.ItemText><Select.ItemIndicator><Check aria-hidden="true" /></Select.ItemIndicator></Select.Item>)}</Select.List></Select.Popup></Select.Positioner></Select.Portal>
  </Select.Root></DirectionProvider>;
}
