"use client";

import { login, signup } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const res = isLogin ? await login(formData) : await signup(formData);
      if (res?.error) {
        setError(res.error);
      }
    } catch (err) {
      setError("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4" dir="rtl">
      <Card className="w-full max-w-md shadow-lg border-slate-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-sky-700">
            {isLogin ? "تسجيل الدخول" : "حساب جديد"}
          </CardTitle>
          <CardDescription>
            {isLogin ? "أدخل بياناتك للوصول إلى لوحة التحكم" : "قم بإنشاء حساب لإدارة عيادتك"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" name="email" type="email" placeholder="doctor@clinic.com" required className="text-left" dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input id="password" name="password" type="password" required className="text-left" dir="ltr" />
            </div>
            
            {error && (
              <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700" disabled={loading}>
              {loading ? "جاري التحميل..." : (isLogin ? "دخول" : "إنشاء حساب")}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t p-4 mt-4">
          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-sm text-slate-500 hover:text-sky-600 transition-colors"
          >
            {isLogin ? "لا تملك حساباً؟ أنشئ حساباً جديداً" : "لديك حساب بالفعل؟ سجل دخولك"}
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}
