"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createAppointment, updateAppointmentStatus } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CalendarClient({ patients, initialAppointments }: { patients: any[], initialAppointments: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  
  // Form State
  const [patientId, setPatientId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !date || !time) {
      toast.error("يرجى تعبئة الحقول الأساسية");
      return;
    }

    setLoading(true);
    const res = await createAppointment({
      patient_id: patientId,
      appointment_date: date,
      start_time: time,
      duration_minutes: 30, // Default for now
      reason
    });

    setLoading(false);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("تم حجز الموعد بنجاح");
      setOpen(false);
      // Reset form
      setPatientId("");
      setDate("");
      setTime("");
      setReason("");
      router.refresh();
    }
  };

  const handleStatusChange = async (id: string, status: any) => {
    const res = await updateAppointmentStatus(id, status);
    if (res.success) {
      toast.success("تم تحديث حالة الموعد");
      router.refresh();
    }
  };

  // Group appointments by date
  const grouped = initialAppointments.reduce((acc, curr) => {
    if (!acc[curr.appointment_date]) acc[curr.appointment_date] = [];
    acc[curr.appointment_date].push(curr);
    return acc;
  }, {} as Record<string, any[]>);

  // Sort dates
  const sortedDates = Object.keys(grouped).sort();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
        <div className="flex gap-4">
          <Button variant="outline">اليوم</Button>
          <Button variant="outline">الأسبوع</Button>
          <Button variant="outline">الشهر</Button>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors text-sm font-medium">
            + موعد جديد
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>حجز موعد جديد</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>المريض</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  required
                >
                  <option value="">-- اختر المريض --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.full_name} - {p.phone}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>تاريخ الموعد</Label>
                <Input type="date" required value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>الوقت</Label>
                <Input type="time" required value={time} onChange={e => setTime(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>سبب الزيارة (اختياري)</Label>
                <Input placeholder="مثال: فحص دوري، ألم أسنان..." value={reason} onChange={e => setReason(e.target.value)} />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-sky-600 hover:bg-sky-700">
                {loading ? "جاري الحفظ..." : "حفظ الموعد"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {sortedDates.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center h-64 text-slate-500">
            <p>لا توجد مواعيد مجدولة حالياً.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {sortedDates.map(dateStr => {
            const dateObj = new Date(dateStr);
            const isToday = dateObj.toDateString() === new Date().toDateString();
            
            return (
              <Card key={dateStr} className={`overflow-hidden ${isToday ? 'border-sky-300 shadow-md ring-1 ring-sky-100' : ''}`}>
                <CardHeader className={`${isToday ? 'bg-sky-50' : 'bg-slate-50'} py-3`}>
                  <CardTitle className="text-lg flex justify-between items-center">
                    <span>
                      {dateObj.toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    {isToday && <span className="text-xs bg-sky-600 text-white px-2 py-1 rounded-full">اليوم</span>}
                  </CardTitle>
                </CardHeader>
                <div className="divide-y">
                  {grouped[dateStr].map((apt: any) => (
                    <div key={apt.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-6">
                        <div className="flex flex-col items-center justify-center w-20 text-sky-700 font-bold border-l pl-4">
                          <span className="text-xl">{apt.start_time.substring(0, 5)}</span>
                          <span className="text-xs text-slate-400 font-normal">30 دقيقة</span>
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-lg">
                            {apt.patient?.full_name}
                          </div>
                          <div className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                            <span>📞 {apt.patient?.phone}</span>
                            {apt.reason && (
                              <>
                                <span>•</span>
                                <span>{apt.reason}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <select
                          value={apt.status}
                          onChange={(e) => handleStatusChange(apt.id, e.target.value)}
                          className={`text-sm rounded-full px-3 py-1 outline-none font-medium ${
                            apt.status === 'scheduled' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                            apt.status === 'completed' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                            'bg-rose-100 text-rose-700 border border-rose-200'
                          }`}
                        >
                          <option value="scheduled">⏱️ قادم</option>
                          <option value="completed">✅ مكتمل</option>
                          <option value="cancelled">❌ ملغي</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
