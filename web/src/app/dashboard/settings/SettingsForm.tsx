"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { updateProfile } from "./actions";
import { toast } from "sonner";
import Link from "next/link";

export default function SettingsForm({ profile }: { profile: any }) {
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await updateProfile(formData);
    
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("تم تحديث البيانات بنجاح");
      setIsSaved(true);
    }
    setLoading(false);
  };

  if (isSaved) {
    return (
      <Card className="border-sky-100 bg-sky-50/50">
        <CardContent className="flex flex-col items-center text-center py-12">
          <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">تم الحفظ بنجاح!</h2>
          <p className="text-slate-600 mb-8 max-w-sm">تم تحديث بيانات العيادة وسيتم تطبيقها على جميع الفواتير والوصفات الطبية الجديدة.</p>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setIsSaved(false)}>
              تعديل مرة أخرى
            </Button>
            <Button render={<Link href="/dashboard" />} className="bg-sky-600 hover:bg-sky-700">
              العودة للرئيسية
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>البيانات الأساسية</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clinicName">اسم العيادة</Label>
            <Input id="clinicName" name="clinicName" defaultValue={profile?.clinic_name || ""} placeholder="عيادة ابتسامة لطب الأسنان" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="doctorName">اسم الطبيب</Label>
            <Input id="doctorName" name="doctorName" defaultValue={profile?.doctor_name || ""} placeholder="د. أحمد محمد" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">رقم هاتف العيادة</Label>
              <Input id="phone" name="phone" defaultValue={profile?.phone || ""} placeholder="0500000000" dir="ltr" className="text-right" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">العنوان</Label>
              <Input id="address" name="address" defaultValue={profile?.address || ""} placeholder="الرياض، شارع التخصصي" />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" className="bg-sky-600 hover:bg-sky-700" disabled={loading}>
              {loading ? "جاري الحفظ..." : "حفظ الإعدادات"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
