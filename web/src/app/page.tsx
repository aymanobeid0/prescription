import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900" dir="rtl">
      <header className="px-8 py-6 flex justify-between items-center bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-sky-700">DentalSaaS</h1>
        <nav>
          <Link href="/dashboard" className="text-sm font-medium hover:text-sky-600 transition-colors">
            تسجيل الدخول
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 mt-16">
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
          أدر عيادتك بسهولة وصمم فواتيرك باحترافية
        </h2>
        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mb-10">
          منصة متكاملة لأطباء الأسنان تتيح لك إدارة مرضاك، تنظيم مواعيدك، وتصميم وصفات طبية وفواتير مخصصة قابلة للطباعة والمشاركة بضغطة زر.
        </p>
        
        <div className="flex gap-4">
          <Link href="/designer">
            <Button size="lg" className="bg-sky-600 hover:bg-sky-700 text-white font-semibold text-lg px-8">
              جرب المصمم مجاناً
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="font-semibold text-lg px-8">
              ابدأ الآن
            </Button>
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold mb-3 text-sky-700">إدارة المرضى</h3>
            <p className="text-slate-600">سجل طبي متكامل، وتتبع لحالة الدفع والمواعيد القادمة لكل مريض.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold mb-3 text-sky-700">تصميم المستندات</h3>
            <p className="text-slate-600">مصمم مرئي تفاعلي لبناء الوصفات الطبية والفواتير المخصصة بعيادتك.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold mb-3 text-sky-700">مشاركة سريعة</h3>
            <p className="text-slate-600">إرسال الفواتير والوصفات عبر الواتساب أو البريد الإلكتروني بضغطة واحدة.</p>
          </div>
        </div>
      </main>

      <footer suppressHydrationWarning className="py-8 text-center text-slate-500 text-sm mt-20 border-t bg-white">
        &copy; {new Date().getFullYear()} DentalSaaS. جميع الحقوق محفوظة.
      </footer>
    </div>
  );
}

