"use client";

import { useState, useEffect } from "react";
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
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  
  // View State
  const [view, setView] = useState<"all" | "day" | "week" | "month">("all");
  
  // Form State
  const [patientId, setPatientId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("30");
  const [reason, setReason] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !date || !time || !duration) {
      toast.error("يرجى تعبئة الحقول الأساسية");
      return;
    }

    setLoading(true);
    const res = await createAppointment({
      patient_id: patientId,
      appointment_date: date,
      start_time: time,
      duration_minutes: parseInt(duration),
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
      setDuration("30");
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

  if (!mounted) return null; // Avoid hydration mismatch on dates

  // Filter appointments
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredAppointments = initialAppointments.filter(apt => {
    const aptDate = new Date(apt.appointment_date);
    if (view === "all") return true;
    if (view === "day") {
      return aptDate.toDateString() === today.toDateString();
    }
    if (view === "week") {
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      return aptDate >= today && aptDate <= nextWeek;
    }
    if (view === "month") {
      return aptDate.getMonth() === today.getMonth() && aptDate.getFullYear() === today.getFullYear();
    }
    return true;
  });

  // Group appointments by date
  const grouped = filteredAppointments.reduce((acc, curr) => {
    if (!acc[curr.appointment_date]) acc[curr.appointment_date] = [];
    acc[curr.appointment_date].push(curr);
    return acc;
  }, {} as Record<string, any[]>);

  // Sort dates
  const sortedDates = Object.keys(grouped).sort();

  // Simple Month Grid Generation
  const renderMonthGrid = () => {
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Padding
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`pad-${i}`} className="p-2 border bg-gray-50/50 min-h-[100px]"></div>);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayApps = grouped[dateStr] || [];
      const isToday = today.getDate() === i;
      
      days.push(
        <div key={i} className={`p-2 border min-h-[100px] flex flex-col gap-1 ${isToday ? 'bg-sky-50' : 'bg-white'}`}>
          <div className={`text-sm font-semibold ${isToday ? 'text-sky-600' : 'text-gray-700'}`}>{i}</div>
          {dayApps.map(apt => (
            <div key={apt.id} className="text-xs bg-sky-100 text-sky-800 p-1 rounded truncate" title={apt.patient?.full_name}>
              {apt.start_time.substring(0, 5)} {apt.patient?.full_name}
            </div>
          ))}
        </div>
      );
    }

    const weekDays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

    return (
      <div className="w-full mt-4">
        <div className="grid grid-cols-7 text-center font-bold text-sm text-gray-500 mb-2">
          {weekDays.map(d => <div key={d}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 border-l border-t" style={{ direction: 'rtl' }}>
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
        <div className="flex gap-2">
          <Button variant={view === "all" ? "default" : "outline"} onClick={() => setView("all")}>الكل</Button>
          <Button variant={view === "day" ? "default" : "outline"} onClick={() => setView("day")}>اليوم</Button>
          <Button variant={view === "week" ? "default" : "outline"} onClick={() => setView("week")}>الأسبوع</Button>
          <Button variant={view === "month" ? "default" : "outline"} onClick={() => setView("month")}>شبكة الشهر</Button>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors text-sm font-medium">
            + موعد جديد
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">حجز موعد جديد</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5 mt-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">المريض</Label>
                <select 
                  className="h-10 w-full min-w-0 rounded-lg border border-input bg-transparent px-3 py-2 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
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
                <Label className="text-sm font-semibold">تاريخ الموعد</Label>
                <Input type="date" required value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">الوقت</Label>
                  <Input type="time" required value={time} onChange={e => setTime(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">المدة</Label>
                  <select 
                    className="h-10 w-full min-w-0 rounded-lg border border-input bg-transparent px-3 py-2 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  >
                    <option value="15">15 دقيقة</option>
                    <option value="30">30 دقيقة</option>
                    <option value="45">45 دقيقة</option>
                    <option value="60">60 دقيقة (ساعة)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">سبب الزيارة (اختياري)</Label>
                <Input placeholder="مثال: فحص دوري، ألم أسنان..." value={reason} onChange={e => setReason(e.target.value)} />
              </div>
              <div className="pt-2">
                <Button type="submit" disabled={loading} className="w-full h-12 text-base font-bold bg-sky-600 hover:bg-sky-700 shadow-md">
                  {loading ? "جاري الحفظ..." : "حفظ الموعد"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {view === "month" ? (
        <Card className="overflow-hidden">
          <CardHeader className="bg-white">
            <CardTitle className="text-lg text-center">
              {today.toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' })}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {renderMonthGrid()}
          </CardContent>
        </Card>
      ) : sortedDates.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center h-64 text-slate-500">
            <p>لا توجد مواعيد مجدولة حالياً لهذه الفترة.</p>
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
                          <span className="text-xs text-slate-400 font-normal">{apt.duration_minutes} دقيقة</span>
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




