"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addPatient(formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "غير مصرح لك للقيام بهذه العملية" };

  const fullName = formData.get("fullName") as string;
  const phone = formData.get("phone") as string;
  const ageStr = formData.get("age") as string;
  const gender = formData.get("gender") as string;
  const fileNo = formData.get("fileNo") as string;

  if (!fullName) {
    return { error: "الاسم الكامل مطلوب" };
  }

  const { error } = await supabase.from("patients").insert({
    doctor_id: user.id,
    full_name: fullName,
    phone: phone || null,
    age: ageStr ? parseInt(ageStr, 10) : null,
    gender: gender || null,
    file_no: fileNo || null,
  });

  if (error) {
    console.error("Error adding patient:", error);
    return { error: "حدث خطأ أثناء إضافة المريض" };
  }

  revalidatePath("/dashboard/patients");
  return { success: true };
}
