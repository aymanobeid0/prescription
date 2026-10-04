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

  // Fetch existing appointments for that date
  const { data: existingApps } = await supabase
    .from("appointments")
    .select("start_time, duration_minutes, status")
    .eq("doctor_id", user.id)
    .eq("appointment_date", data.appointment_date)
    .neq("status", "cancelled");

  // Check for conflict
  if (existingApps && existingApps.length > 0) {
    const parseTime = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    const newStart = parseTime(data.start_time);
    const newEnd = newStart + data.duration_minutes;

    for (const app of existingApps) {
      const appStart = parseTime(app.start_time);
      const appEnd = appStart + app.duration_minutes;

      if ((newStart >= appStart && newStart < appEnd) ||
          (newEnd > appStart && newEnd <= appEnd) ||
          (newStart <= appStart && newEnd >= appEnd)) {
        return { error: "يوجد تعارض مع موعد آخر في نفس الوقت" };
      }
    }
  }

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
