import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-800 transition-colors font-medium mb-2">
        <span>&rarr;</span>
        <span>العودة للرئيسية</span>
      </Link>
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">إعدادات العيادة</h1>
        <p className="text-slate-500 mt-2">تحديث بيانات العيادة لتظهر في ترويسة الفواتير والوصفات.</p>
      </div>

      <SettingsForm profile={profile || {}} />
    </div>
  );
}






