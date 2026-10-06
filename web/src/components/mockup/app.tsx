"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { CalendarDays, UsersRound, MessageSquareText, ReceiptText, Settings, Bell, ChevronDown, Languages, Plus, Menu, Building2, CheckCircle2, X } from "lucide-react";
import { MockupContext, type ModalState } from "./context";
import { clinicDate, initialPatients, initialSettings, seedAppointments, seedInvoices, seedRequests, type Appointment, type BookingRequest, type ClinicSettings, type Locale, type Patient } from "./data";
import { translator, type Label } from "./labels";
import { Action, Avatar, Modal, SearchField } from "./primitives";
import { Schedule } from "./schedule";
import { PatientsPage, RequestsPage, BillingPage, SettingsPage } from "./pages";
import { MockupDialogs } from "./dialogs";

const navigation = [
  { key: "schedule", path: "/mockup", icon: CalendarDays },
  { key: "patients", path: "/mockup/patients", icon: UsersRound },
  { key: "requests", path: "/mockup/requests", icon: MessageSquareText },
  { key: "billing", path: "/mockup/billing", icon: ReceiptText },
  { key: "settings", path: "/mockup/settings", icon: Settings },
] as const;

export function MockupApp({ children, initialTime }: { children: ReactNode; initialTime: string }) {
  const pathname = usePathname(); const router = useRouter();
  const [locale, setLocale] = useState<Locale>("ar"); const t = translator(locale);
  const [patients, setPatients] = useState(initialPatients);
  const initialDate = clinicDate(new Date(initialTime), initialSettings.timezone);
  const [appointments, setAppointments] = useState<Appointment[]>(() => seedAppointments(initialDate));
  const [requests, setRequests] = useState<BookingRequest[]>(() => seedRequests(initialDate));
  const [invoices] = useState(() => seedInvoices(initialDate));
  const [notices, setNotices] = useState([{ id: "n1", requestId: "R-2041", read: false }, { id: "n2", requestId: "R-2042", read: false }, { id: "n3", requestId: "R-2043", read: true }]);
  const [settings, setSettings] = useState(initialSettings);
  const [date, setDate] = useState(initialDate); const [now, setNow] = useState<Date>(() => new Date(initialTime));
  const today = clinicDate(now, settings.timezone);
  const [dentist, setDentist] = useState("all"); const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalState | null>(null); const [returnFocus, setReturnFocus] = useState<HTMLElement | null>(null);
  const [mobileNav, setMobileNav] = useState(false); const [message, setMessage] = useState<Label | null>(null);
  const mainTitle = useRef<HTMLHeadingElement | null>(null);
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => { document.documentElement.lang = locale; document.documentElement.dir = locale === "ar" ? "rtl" : "ltr"; return () => { document.documentElement.lang = "ar"; document.documentElement.dir = "rtl"; }; }, [locale]);
  useEffect(() => { if (!message) return; const timer = setTimeout(() => setMessage(null), 4500); return () => clearTimeout(timer); }, [message]);
  useEffect(() => { mainTitle.current?.focus(); }, [pathname]);

  const openModal = (value: ModalState) => { if (!modal) setReturnFocus(document.activeElement instanceof HTMLElement ? document.activeElement : null); setModal(value); };
  const closeModal = () => setModal(null);
  const navigate = (path: string) => { closeModal(); setMobileNav(false); router.push(path); };
  const saveAppointment = (appointment: Appointment, requestId?: string) => {
    setAppointments(current => current.some(a => a.id === appointment.id) ? current.map(a => a.id === appointment.id ? appointment : a) : [...current, appointment]);
    if (requestId) setRequests(current => current.map(r => r.id === requestId ? { ...r, status: "confirmed", appointmentId: appointment.id, delivery: ["delivered", "delivered"] } : r));
    setMessage(requestId ? "requestConfirmed" : appointments.some(a => a.id === appointment.id) ? "updated" : "created"); closeModal();
  };
  const updateStatus = (id: string, status: Appointment["status"]) => { setAppointments(current => current.map(a => a.id === id ? { ...a, status } : a)); setMessage(status === "cancelled" ? "appointmentCancelled" : "updated"); closeModal(); };
  const addPatient = (patient: Patient) => { setPatients(current => [...current, patient]); setMessage("patientCreated"); closeModal(); };
  const rejectRequest = (id: string) => { setRequests(current => current.map(r => r.id === id ? { ...r, status: "rejected", delivery: ["delivered", "delivered"] } : r)); setMessage("requestRejected"); closeModal(); };
  const saveSettings = (value: ClinicSettings, nextLocale: Locale) => { setSettings(value); setLocale(nextLocale); setMessage("saved"); };
  const page = navigation.find(n => n.path === pathname || (n.key === "patients" && pathname.startsWith(n.path + "/")))?.key || "schedule";
  const pending = requests.filter(r => r.status === "pending").length; const unread = notices.filter(n => !n.read).length;
  const searchResults = search.trim() ? patients.filter(p => `${p.name.ar} ${p.name.fr} ${p.phone}`.toLowerCase().includes(search.toLowerCase().trim())).slice(0, 5) : [];
  const context = { locale, setLocale, t, patients, appointments, requests, notices, invoices, settings, today, date, setDate, now, dentist, setDentist, search, setSearch, openModal, closeModal, navigate, saveAppointment, updateStatus, addPatient, rejectRequest, readNotice: (id: string) => setNotices(current => current.map(n => n.id === id ? { ...n, read: true } : n)), saveSettings };

  return <MockupContext.Provider value={context}><div className="mk-app mk-scope" lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
    <aside className={`mk-sidebar ${mobileNav ? "mk-sidebar-open" : ""}`}>
      <Link href="/mockup" className="mk-brand" onClick={() => setMobileNav(false)}><span className="mk-brand-symbol"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5c-3-3-8-2-8 3 0 3 1.5 5 2 8 .4 2.5 1 5 2.5 5 1.7 0 1.3-7 3.5-7s1.8 7 3.5 7c1.5 0 2.1-2.5 2.5-5 .5-3 2-5 2-8 0-5-5-6-8-3Z" /><path d="m9 4 4 3" /></svg></span><span dir="ltr">DentalCare</span></Link>
      <div className="mk-clinic"><Building2 /><div><strong>{settings.name[locale]}</strong><span>{t("mockup")}</span></div></div>
      <nav aria-label={t("mockup")}>{navigation.map(({ key, path, icon: Icon }) => <Link key={key} href={path} onClick={() => setMobileNav(false)} className={`mk-nav-link ${page === key ? "mk-nav-active" : ""}`} aria-current={page === key ? "page" : undefined}><Icon /><span>{t(key)}</span>{key === "requests" && pending > 0 && <span className="mk-nav-count" data-testid="pending-badge">{pending}</span>}</Link>)}</nav>
      <div className="mk-sidebar-bottom"><span className="mk-demo-dot" />{t("sessionOnly")}</div>
    </aside>
    {mobileNav && <button className="mk-nav-scrim" aria-label={t("close")} onClick={() => setMobileNav(false)} />}
    <div className="mk-workspace">
      <header className="mk-header">
        <button className="mk-icon-button mk-menu" aria-label={t("mockup")} aria-expanded={mobileNav} onClick={() => setMobileNav(!mobileNav)}><Menu /></button>
        <div className="mk-global-search"><SearchField value={search} onChange={setSearch} t={t} />{search.trim() && <div className="mk-search-results">{searchResults.length ? searchResults.map(p => <button key={p.id} onClick={() => { setSearch(""); navigate(`/mockup/patients/${p.id}`); }}><Avatar name={p.name[locale]} /><span>{p.name[locale]}<bdi>{p.phone}</bdi></span></button>) : <p>{t("empty")}</p>}</div>}</div>
        <div className="mk-header-actions"><button className="mk-language" aria-label={t("language")} onClick={() => setLocale(locale === "ar" ? "fr" : "ar")}><Languages /><span>{locale === "ar" ? "Français" : "العربية"}</span></button>
          <button className="mk-icon-button mk-bell" aria-label={`${t("notifications")} (${unread})`} onClick={() => openModal({ kind: "notifications" })}><Bell />{unread > 0 && <span data-testid="unread-badge">{unread}</span>}</button>
          <button className="mk-account" onClick={() => openModal({ kind: "account" })} aria-label={t("account")}><Avatar name={locale === "ar" ? "سلمى أمين" : "Salma Amine"} /><span><strong>{locale === "ar" ? "سلمى أمين" : "Salma Amine"}</strong><small>{t("receptionist")}</small></span><ChevronDown /></button>
        </div>
      </header>
      <main className="mk-main">
        <div className="mk-page-heading"><div><h1 ref={mainTitle} tabIndex={-1}>{t(page)}</h1><p>{t((page === "schedule" ? "scheduleSubtitle" : page === "patients" ? "patientsSubtitle" : page === "requests" ? "requestsSubtitle" : page === "billing" ? "billingSubtitle" : "settingsSubtitle"))}</p></div>{page === "patients" && !pathname.split("/")[3] && <Action variant="primary" onClick={() => openModal({ kind: "newPatient" })}><Plus />{t("newPatient")}</Action>}</div>
        {page === "schedule" ? <Schedule /> : page === "patients" ? <PatientsPage patientId={pathname.split("/")[3]} /> : page === "requests" ? <RequestsPage /> : page === "billing" ? <BillingPage /> : <SettingsPage />}
        {children}
      </main>
    </div>
    <div className="mk-toast-region" aria-live="polite">{message && <div className="mk-toast"><CheckCircle2 />{t(message)}<button aria-label={t("close")} onClick={() => setMessage(null)}><X /></button></div>}</div>
    {modal && <Modal title={t(modal.kind === "appointment" ? "appointmentDetails" : modal.kind === "editAppointment" ? "edit" : modal.kind === "cancelAppointment" ? "confirmCancel" : modal.kind === "newAppointment" ? "newAppointment" : modal.kind === "newPatient" ? "newPatient" : modal.kind === "notifications" ? "notifications" : modal.kind === "account" ? "account" : modal.kind === "invoice" ? "documentPreview" : modal.kind === "rejectRequest" ? "confirmReject" : "requestReview")} locale={locale} t={t} onClose={closeModal} returnFocus={returnFocus} wide={modal.kind === "invoice"}><MockupDialogs key={`${modal.kind}-${"id" in modal ? modal.id : ""}`} modal={modal} /></Modal>}
  </div></MockupContext.Provider>;
}
