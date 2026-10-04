"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "غير مصرح لك" };

  const clinicName = formData.get("clinicName") as string;
  const doctorName = formData.get("doctorName") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;

  const { error } = await supabase
    .from("profiles")
    .update({
      clinic_name: clinicName,
      doctor_name: doctorName,
      phone: phone,
      address: address,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { error: "فشل في تحديث البيانات" };
  }

  revalidatePath("/dashboard/settings");
  return { success: true };
}
