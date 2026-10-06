export type Locale = "ar" | "fr";
export type Localized = Record<Locale, string>;
export type Patient = { id: string; name: Localized; phone: string; age: number; alert?: Localized };
export type Appointment = { id: string; patientId: string; dentistId: string; date: string; start: number; duration: number; status: "confirmed" | "arrived" | "completed" | "cancelled"; note: string };
export type BookingRequest = { id: string; patientId: string; senderPhone: string; date: string; start: number; dentistId: string; status: "pending" | "confirmed" | "rejected"; appointmentId?: string; delivery?: ["delivered" | "failed", "delivered" | "failed"] };
export type Notice = { id: string; requestId: string; read: boolean };
export type Invoice = { id: string; patientId: string; date: string; status: "paid" | "unpaid"; items: { name: Localized; amount: number }[] };
export type ClinicSettings = { name: Localized; timezone: string; open: string; close: string };
export const dentists = [
  { id: "d1", name: { ar: "د. سارة بن علي", fr: "Dr Sarah Ben Ali" }, specialty: { ar: "طب الأسنان العام", fr: "Dentisterie générale" } },
  { id: "d2", name: { ar: "د. أمين العلوي", fr: "Dr Amine Alaoui" }, specialty: { ar: "طب الأسنان العام", fr: "Dentisterie générale" } },
];
export const initialSettings: ClinicSettings = { name: { ar: "عيادة النور للأسنان", fr: "Cabinet dentaire Al Nour" }, timezone: "Africa/Casablanca", open: "08:00", close: "18:00" };
export function clinicDate(now: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  return ["year", "month", "day"].map(k => parts.find(p => p.type === k)?.value).join("-");
}
export function clinicMinutes(now: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: timezone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(now);
  return Number(parts.find(p => p.type === "hour")?.value) * 60 + Number(parts.find(p => p.type === "minute")?.value);
}
export function clock(minutes: number) { return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`; }
export function minutes(value: string) { const [h, m] = value.split(":").map(Number); return h * 60 + m; }
export function moveDay(date: string, amount: number) { const d = new Date(`${date}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + amount); return d.toISOString().slice(0, 10); }
export function displayDate(date: string, locale: Locale, full = false) {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-MA" : "fr-FR", { timeZone: "UTC", day: "numeric", month: full ? "long" : "short", ...(full ? { weekday: "long", year: "numeric" } : {}) }).format(new Date(`${date}T12:00:00Z`));
}
export const initialPatients: Patient[] = [
  { id: "P-1001", name: { ar: "ليلى منصوري", fr: "Leila Mansouri" }, phone: "+212600000101", age: 34, alert: { ar: "حساسية من البنسلين", fr: "Allergie à la pénicilline" } },
  { id: "P-1002", name: { ar: "يوسف بن عمر", fr: "Youssef Ben Omar" }, phone: "+212600000102", age: 42 },
  { id: "P-1003", name: { ar: "مريم الإدريسي", fr: "Meryem Idrissi" }, phone: "+212600000103", age: 28 },
  { id: "P-1004", name: { ar: "آدم العلوي", fr: "Adam Alaoui" }, phone: "+212600000104", age: 19 },
  { id: "P-1005", name: { ar: "فاطمة الزهراء", fr: "Fatima Zahra" }, phone: "+212600000105", age: 51, alert: { ar: "داء السكري — ملاحظة مسجلة", fr: "Diabète — note au dossier" } },
  { id: "P-1006", name: { ar: "سامي رحماني", fr: "Sami Rahmani" }, phone: "+212600000106", age: 37 },
  { id: "P-1007", name: { ar: "نور الحداد", fr: "Nour Haddad" }, phone: "+212600000107", age: 25 },
  { id: "P-1008", name: { ar: "عمر السالمي", fr: "Omar Salmi" }, phone: "+212600000108", age: 46 },
];
export function seedAppointments(date: string): Appointment[] {
  return [
    ["a1", "P-1001", "d1", 540, 45, "confirmed"], ["a2", "P-1002", "d2", 555, 30, "completed"],
    ["a3", "P-1003", "d1", 615, 60, "arrived"], ["a4", "P-1004", "d2", 660, 45, "confirmed"],
    ["a5", "P-1005", "d1", 750, 30, "confirmed"], ["a6", "P-1006", "d2", 780, 60, "confirmed"],
    ["a7", "P-1007", "d1", 870, 5, "confirmed"], ["a8", "P-1008", "d2", 900, 45, "confirmed"],
  ].map(([id, patientId, dentistId, start, duration, status]) => ({ id, patientId, dentistId, date, start, duration, status, note: "" }) as Appointment);
}
export function seedRequests(date: string): BookingRequest[] {
  return [
    { id: "R-2041", patientId: "P-1002", senderPhone: "+212600000202", date, start: 960, dentistId: "d1", status: "pending" },
    { id: "R-2042", patientId: "P-1007", senderPhone: "+212600000107", date, start: 990, dentistId: "d2", status: "pending" },
    { id: "R-2043", patientId: "P-1008", senderPhone: "+212600000208", date: moveDay(date, 1), start: 600, dentistId: "d1", status: "pending" },
  ];
}
export function seedInvoices(date: string): Invoice[] {
  return [
    { id: "FAC-2026-001", patientId: "P-1002", date, status: "paid", items: [{ name: { ar: "استشارة", fr: "Consultation" }, amount: 200 }, { name: { ar: "تنظيف الأسنان", fr: "Détartrage" }, amount: 350 }] },
    { id: "FAC-2026-002", patientId: "P-1001", date: moveDay(date, -1), status: "unpaid", items: [{ name: { ar: "ترميم الأسنان", fr: "Restauration dentaire" }, amount: 600 }] },
    { id: "FAC-2026-003", patientId: "P-1005", date: moveDay(date, -2), status: "paid", items: [{ name: { ar: "استشارة", fr: "Consultation" }, amount: 200 }] },
  ];
}
export function appointmentError(candidate: Appointment, existing: Appointment[], settings: ClinicSettings): "hoursError" | "overlap" | null {
  if (!Number.isFinite(candidate.start) || !Number.isFinite(candidate.duration) || candidate.duration < 5 || candidate.duration > 240 || candidate.start < minutes(settings.open) || candidate.start + candidate.duration > minutes(settings.close)) return "hoursError";
  if (existing.some(a => a.id !== candidate.id && a.status !== "cancelled" && a.date === candidate.date && (a.dentistId === candidate.dentistId || a.patientId === candidate.patientId) && candidate.start < a.start + a.duration && candidate.start + candidate.duration > a.start)) return "overlap";
  return null;
}
