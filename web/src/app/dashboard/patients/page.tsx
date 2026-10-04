import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import AddPatientDialog from "./AddPatientDialog";

export default async function PatientsPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession(); const user = session?.user;

  if (!user) {
    redirect("/login");
  }

  // Fetch patients for this doctor
  const { data: patients, error } = await supabase
    .from("patients")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">سجل المرضى</h1>
          <p className="text-slate-500 mt-2">إدارة مرضاك وسجلاتهم الطبية.</p>
        </div>
        <AddPatientDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة المرضى</CardTitle>
        </CardHeader>
        <CardContent>
          {!patients || patients.length === 0 ? (
            <div className="text-center p-12 text-slate-500">
              لا يوجد مرضى مسجلين حتى الآن. انقر على "إضافة مريض جديد" للبدء.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الاسم الكامل</TableHead>
                  <TableHead className="text-right">رقم الملف</TableHead>
                  <TableHead className="text-right">رقم الهاتف</TableHead>
                  <TableHead className="text-right">العمر</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.full_name}</TableCell>
                    <TableCell>{patient.file_no || "-"}</TableCell>
                    <TableCell dir="ltr" className="text-right">{patient.phone || "-"}</TableCell>
                    <TableCell>{patient.age ? `${patient.age} سنة` : "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Link href={`/dashboard/patients/${patient.id}`} className="text-sky-600 hover:text-sky-800 transition-colors text-sm font-medium">
                          ملف المريض
                        </Link>
                        <span className="text-slate-300">|</span>
                        <Link href={`/dashboard/patients/${patient.id}/issue`} className="text-slate-500 hover:text-slate-700 transition-colors text-sm font-medium flex items-center gap-1">
                          <span>مستند جديد</span>
                          <span className="text-lg leading-none">+</span>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

