import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import IssueDocumentClient from "./IssueDocumentClient";

export default async function IssueDocumentPage(
  props: { params: Promise<{ patientId: string }> }
) {
  const params = await props.params;
  const patientId = params.patientId;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: patient } = await supabase
    .from("patients")
    .select("*")
    .eq("id", patientId)
    .single();

  if (!patient) return <div>المريض غير موجود</div>;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="w-full h-full -m-6"> {/* Negative margin to counteract dashboard layout padding if any */}
      <IssueDocumentClient patient={patient} profile={profile || {}} />
    </div>
  );
}
