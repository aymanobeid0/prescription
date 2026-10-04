"use server";

import { createClient } from "@/lib/supabase/server";

export async function createDocumentRecord(patientId: string, docType: string, content: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "غير مصرح لك" };

  const { data, error } = await supabase
    .from("documents")
    .insert({
      patient_id: patientId,
      doc_type: docType,
      content: content,
    })
    .select("id")
    .single();

  if (error) {
    console.error(error);
    return { error: "حدث خطأ أثناء إصدار المستند" };
  }

  return { docId: data.id };
}
