"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addPatient } from "./actions";

export default function AddPatientDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const res = await addPatient(formData);
    
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      setLoading(false);
      setOpen(false); // Close dialog on success
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="bg-sky-600 hover:bg-sky-700 text-white" />}>
        + إضافة مريض جديد
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>مريض جديد</DialogTitle>
          <DialogDescription>
            أدخل بيانات المريض الجديد واضغط على حفظ.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">الاسم الكامل *</Label>
            <Input id="fullName" name="fullName" placeholder="أحمد محمد" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">رقم الهاتف</Label>
            <Input id="phone" name="phone" placeholder="0500000000" dir="ltr" className="text-right" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">العمر</Label>
              <Input id="age" name="age" type="number" placeholder="30" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">الجنس</Label>
              <select 
                id="gender" 
                name="gender"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fileNo">رقم الملف (إن وجد)</Label>
            <Input id="fileNo" name="fileNo" placeholder="F-1234" />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" className="bg-sky-600 hover:bg-sky-700" disabled={loading}>
              {loading ? "جاري الحفظ..." : "حفظ بيانات المريض"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}




