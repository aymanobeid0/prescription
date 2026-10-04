import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CalendarClient from "./CalendarClient";

export default async function CalendarPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch all patients for the dropdown
  const { data: patients } = await supabase
    .from("patients")
    .select("id, full_name, phone")
    .order("full_name");

  // Fetch appointments
  const { data: appointments } = await supabase
    .from("appointments")
    .select(`
      *,
      patient:patients(full_name, phone)
    `)
    .order("appointment_date", { ascending: true })
    .order("start_time", { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">تقويم المواعيد</h1>
        <p className="text-slate-500 mt-2">إدارة وتنظيم مواعيد العيادة بشكل يومي وأسبوعي.</p>
      </div>
      
      <CalendarClient patients={patients || []} initialAppointments={appointments || []} />
    </div>
  );
}
