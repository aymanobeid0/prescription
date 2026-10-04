"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createAppointment(data: {
  patient_id: string;
  appointment_date: string;
  start_time: string;
  duration_minutes: number;
  reason: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "غير مصرح" };

  const { data: appointment, error } = await supabase
    .from("appointments")
    .insert({
      doctor_id: user.id,
      patient_id: data.patient_id,
      appointment_date: data.appointment_date,
      start_time: data.start_time,
      duration_minutes: data.duration_minutes,
      reason: data.reason,
      status: "scheduled"
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating appointment:", error);
    return { error: "حدث خطأ أثناء حفظ الموعد" };
  }

  revalidatePath("/dashboard/calendar");
  revalidatePath(`/dashboard/patients/${data.patient_id}`);
  return { success: true, appointment };
}

export async function updateAppointmentStatus(id: string, status: "scheduled" | "completed" | "cancelled") {
  const supabase = await createClient();
  const { error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", id);

  if (error) return { error: "فشل التحديث" };
  revalidatePath("/dashboard/calendar");
  return { success: true };
}
