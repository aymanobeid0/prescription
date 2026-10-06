"use client";
import { createContext, useContext } from "react";
import type { Appointment, BookingRequest, ClinicSettings, Invoice, Locale, Notice, Patient } from "./data";
import type { Translate } from "./labels";

export type ModalState = { kind: "appointment" | "editAppointment" | "cancelAppointment"; id?: string } | { kind: "newAppointment" | "newPatient" | "notifications" | "account" } | { kind: "request" | "rejectRequest" | "invoice"; id: string };
export type MockupContextValue = {
  locale: Locale; setLocale: (locale: Locale) => void; t: Translate;
  patients: Patient[]; appointments: Appointment[]; requests: BookingRequest[]; notices: Notice[]; invoices: Invoice[];
  settings: ClinicSettings; today: string; date: string; setDate: (date: string) => void; now: Date | null;
  dentist: string; setDentist: (id: string) => void; search: string; setSearch: (search: string) => void;
  openModal: (modal: ModalState) => void; closeModal: () => void; navigate: (path: string) => void;
  saveAppointment: (a: Appointment, requestId?: string) => void; updateStatus: (id: string, status: Appointment["status"]) => void;
  addPatient: (patient: Patient) => void; rejectRequest: (id: string) => void; readNotice: (id: string) => void;
  saveSettings: (settings: ClinicSettings, locale: Locale) => void;
};
export const MockupContext = createContext<MockupContextValue | null>(null);
export function useMockup() { const value = useContext(MockupContext); if (!value) throw new Error("Mockup context missing"); return value; }
