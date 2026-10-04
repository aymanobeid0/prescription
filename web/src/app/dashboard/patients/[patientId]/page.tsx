import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function PatientDetailsPage(
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

  const { data: docs } = await supabase
    .from("documents")
    .select("*")
    .eq("patient_id", patientId)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <Link href="/dashboard/patients" className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-800 transition-colors font-medium mb-2">
        <span>&rarr;</span>
        <span>العودة لقائمة المرضى</span>
      </Link>
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{patient.full_name}</h1>
          <p className="text-slate-500 mt-2">رقم الملف: {patient.file_no || "غير متوفر"}</p>
        </div>
        <Link href={`/dashboard/patients/${patient.id}/issue`}>
          <Button className="bg-sky-600 hover:bg-sky-700">مستند جديد</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>سجل المستندات</CardTitle>
        </CardHeader>
        <CardContent>
          {!docs || docs.length === 0 ? (
            <p className="text-slate-500 text-center py-8">لم يتم إصدار أي فواتير أو وصفات لهذا المريض.</p>
          ) : (
            <div className="space-y-4">
              {docs.map(doc => (
                <div key={doc.id} className="flex justify-between items-center p-4 border rounded hover:bg-slate-50">
                  <div>
                    <p className="font-bold">{doc.doc_type === 'rx' ? 'وصفة طبية' : 'فاتورة'}</p>
                    <p className="text-sm text-slate-500">{new Date(doc.created_at).toLocaleDateString('ar-SA')}</p>
                  </div>
                  <Link href={`/dashboard/documents/${doc.id}`}>
                    <Button variant="outline">عرض للطباعة</Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
