"use server";

import { createClient } from "@/lib/supabase/server";
import { AppState } from "@/types/designer";

export async function saveDocument(
  patientId: string, 
  docType: "rx" | "invoice", 
  content: AppState["docs"]["rx"] | AppState["docs"]["invoice"]
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "يرجى تسجيل الدخول أولاً" };
  if (!patientId) return { error: "معرّف المريض مفقود" };

  const { error } = await supabase.from("documents").insert({
    doctor_id: user.id,
    patient_id: patientId,
    doc_type: docType,
    content: content as any,
  });

  if (error) {
    console.error("Save doc error:", error);
    return { error: "حدث خطأ أثناء حفظ المستند" };
  }

  return { success: true };
}
