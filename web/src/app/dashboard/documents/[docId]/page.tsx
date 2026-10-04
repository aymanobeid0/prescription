import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DocumentViewer from "@/components/designer/DocumentViewer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PrintButton from "./PrintButton";

export default async function ViewDocumentPage(
  props: { params: Promise<{ docId: string }> }
) {
  const params = await props.params;
  const docId = params.docId;
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession(); const user = session?.user; //  await supabase.auth.getSession();

  if (!user) redirect("/login");

  const { data: doc } = await supabase
    .from("documents")
    .select("*, patient:patients(*)")
    .eq("id", docId)
    .single();

  if (!doc) return <div className="p-8">المستند غير موجود</div>;

  const title = doc.doc_type === "rx" ? "وصفة طبية" : "فاتورة";
  const patient = doc.patient;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="print:hidden flex items-center justify-between bg-white border-b border-slate-200 p-4 shadow-sm z-10 sticky top-0">
        <div>
          <h1 className="text-xl font-bold text-sky-800">{title} - {patient?.full_name}</h1>
          <p suppressHydrationWarning className="text-sm text-slate-500">التاريخ: {new Date(doc.created_at).toLocaleDateString('ar-SA')}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/patients/${patient?.id}`}>
            <Button variant="outline">العودة لملف المريض</Button>
          </Link>
          <PrintButton />
        </div>
      </div>
      
      <div className="flex-1 bg-slate-50 overflow-auto print:bg-white print:overflow-visible">
        <DocumentViewer doc={doc.content} />
      </div>
    </div>
  );
}

