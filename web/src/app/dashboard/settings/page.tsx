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
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">إعدادات العيادة</h1>
        <p className="text-sm md:text-base text-slate-500 mt-1">تحديث بيانات العيادة لتظهر في ترويسة الفواتير والوصفات.</p>
      </div>

      <SettingsForm profile={profile || {}} />
    </div>
  );
}






