# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: align.spec.ts >> Text alignment applies correctly
- Location: e2e\align.spec.ts:3:5

# Error details

```
Error: locator.click: Error: strict mode violation: locator('button:has-text("يسار")') resolved to 2 elements:
    1) <button class="flex-1 py-1 text-sm hover:bg-slate-200">يسار</button> aka getByRole('button', { name: 'يسار' }).first()
    2) <button class="flex-1 py-1 text-sm hover:bg-slate-200 ">يسار</button> aka getByRole('button', { name: 'يسار' }).nth(1)

Call log:
  - waiting for locator('button:has-text("يسار")')

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - heading "مصمم المستندات" [level=2] [ref=e4]
      - generic [ref=e5]:
        - generic [ref=e6]:
          - button "وصفة طبية" [ref=e7]
          - button "فاتورة" [ref=e8]
        - generic [ref=e9]:
          - button "معاينة الطباعة" [ref=e10]
          - button "حدد مريضاً للحفظ" [disabled]
    - generic [ref=e11]:
      - complementary [ref=e12]:
        - generic [ref=e13]:
          - generic [ref=e14]: اسحب العنصر إلى الورقة لإضافته.
          - generic [ref=e15]:
            - heading "بيانات العيادة" [level=3] [ref=e16]
            - generic [ref=e17]:
              - generic [ref=e18]:
                - generic [ref=e19]: ◎
                - generic [ref=e20]: الشعار
              - generic [ref=e21]:
                - generic [ref=e22]: T
                - generic [ref=e23]: اسم العيادة
              - generic [ref=e24]:
                - generic [ref=e25]: T
                - generic [ref=e26]: اسم الطبيب
              - generic [ref=e27]:
                - generic [ref=e28]: T
                - generic [ref=e29]: الاختصاص
              - generic [ref=e30]:
                - generic [ref=e31]: ☎
                - generic [ref=e32]: هاتف العيادة
              - generic [ref=e33]:
                - generic [ref=e34]: ⌂
                - generic [ref=e35]: العنوان
              - generic [ref=e36]:
                - generic [ref=e37]: "#"
                - generic [ref=e38]: رقم الترخيص
              - generic [ref=e39]:
                - generic [ref=e40]: ◷
                - generic [ref=e41]: أوقات الدوام
          - generic [ref=e42]:
            - heading "بيانات المريض" [level=3] [ref=e43]
            - generic [ref=e44]:
              - generic [ref=e45]:
                - generic [ref=e46]: 👤
                - generic [ref=e47]: اسم المريض
              - generic [ref=e48]:
                - generic [ref=e49]: ☎
                - generic [ref=e50]: رقم الموبايل
              - generic [ref=e51]:
                - generic [ref=e52]: "#"
                - generic [ref=e53]: العمر
              - generic [ref=e54]:
                - generic [ref=e55]: ⚥
                - generic [ref=e56]: الجنس
              - generic [ref=e57]:
                - generic [ref=e58]: "#"
                - generic [ref=e59]: رقم الملف
              - generic [ref=e60]:
                - generic [ref=e61]: ▦
                - generic [ref=e62]: التاريخ
          - generic [ref=e63]:
            - heading "الوصفة" [level=3] [ref=e64]
            - generic [ref=e65]:
              - generic [ref=e66]:
                - generic [ref=e67]: ℞
                - generic [ref=e68]: رمز ℞
              - generic [ref=e69]:
                - generic [ref=e70]: ✚
                - generic [ref=e71]: التشخيص
              - generic [ref=e72]:
                - generic [ref=e73]: ☰
                - generic [ref=e74]: جدول الأدوية
              - generic [ref=e75]:
                - generic [ref=e76]: ✎
                - generic [ref=e77]: تعليمات للمريض
              - generic [ref=e78]:
                - generic [ref=e79]: ▦
                - generic [ref=e80]: الزيارة القادمة
          - generic [ref=e81]:
            - heading "عناصر حرة" [level=3] [ref=e82]
            - generic [ref=e83]:
              - generic [ref=e84]:
                - generic [ref=e85]: H
                - generic [ref=e86]: عنوان
              - generic [ref=e87]:
                - generic [ref=e88]: ¶
                - generic [ref=e89]: نص حر
              - generic [ref=e90]:
                - generic [ref=e91]: —
                - generic [ref=e92]: خط أفقي
              - generic [ref=e93]:
                - generic [ref=e94]: "|"
                - generic [ref=e95]: خط عمودي
              - generic [ref=e96]:
                - generic [ref=e97]: ▭
                - generic [ref=e98]: إطار / خلفية
              - generic [ref=e99]:
                - generic [ref=e100]: ▣
                - generic [ref=e101]: صورة
              - generic [ref=e102]:
                - generic [ref=e103]: ✍
                - generic [ref=e104]: التوقيع
              - generic [ref=e105]:
                - generic [ref=e106]: ◯
                - generic [ref=e107]: ختم العيادة
              - generic [ref=e108]:
                - generic [ref=e109]: ▩
                - generic [ref=e110]: رمز QR
      - main [ref=e111]:
        - generic [active] [ref=e116]: نص قابل للتعديل
      - complementary [ref=e125]:
        - generic [ref=e126]:
          - generic [ref=e127]:
            - heading "نص حر" [level=3] [ref=e128]
            - button "حذف" [ref=e129]
          - generic [ref=e130]:
            - generic [ref=e131]:
              - generic [ref=e132]: العرض (mm)
              - spinbutton "العرض (mm)" [ref=e133]: "60"
            - generic [ref=e134]:
              - generic [ref=e135]: الارتفاع (mm)
              - spinbutton "الارتفاع (mm)" [ref=e136]: "10"
            - generic [ref=e137]:
              - generic [ref=e138]: محتوى النص / القالب
              - textbox "محتوى النص / القالب" [ref=e139]:
                - /placeholder: اكتب المحتوى هنا...
                - text: نص قابل للتعديل
            - generic [ref=e140]:
              - heading "محاذاة العنصر في الورقة" [level=4] [ref=e141]
              - generic [ref=e142]:
                - button "يمين" [ref=e143]
                - button "منتصف" [ref=e144]
                - button "يسار" [ref=e145]
            - generic [ref=e146]:
              - heading "الخط والتنسيق" [level=4] [ref=e147]
              - generic [ref=e148]:
                - generic [ref=e149]: محاذاة النص داخل العنصر
                - generic [ref=e150]:
                  - button "يمين" [ref=e151]
                  - button "توسيط" [ref=e152]
                  - button "يسار" [ref=e153]
              - generic [ref=e154]:
                - generic [ref=e155]: حجم الخط
                - spinbutton "حجم الخط" [ref=e156]: "10"
  - region "Notifications alt+T"
  - button "Open Next.js Dev Tools" [ref=e162] [cursor=pointer]
  - alert [ref=e166]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('Text alignment applies correctly', async ({ page }) => {
  4  |   await page.goto('/designer');
  5  | 
  6  |   const textDraggable = page.locator('text=نص حر').first();
  7  |   const paper = page.locator('.bg-white.shadow-xl').first();
  8  | 
  9  |   await textDraggable.dragTo(paper, { targetPosition: { x: 100, y: 100 } });
  10 |   
  11 |   const canvasElementWrapper = paper.locator('.absolute.overflow-visible').last();
  12 |   await canvasElementWrapper.click();
  13 | 
  14 |   // Find the text inner div
  15 |   const innerDiv = canvasElementWrapper.locator('[contenteditable]');
  16 | 
  17 |   // Click left align button
  18 |   const leftAlignBtn = page.locator('button:has-text("يسار")');
> 19 |   await leftAlignBtn.click();
     |                      ^ Error: locator.click: Error: strict mode violation: locator('button:has-text("يسار")') resolved to 2 elements:
  20 |   await page.waitForTimeout(100);
  21 | 
  22 |   // Check if text align is applied
  23 |   const textAlign = await canvasElementWrapper.evaluate(el => {
  24 |     // Look at the wrapper style which has textAlign applied
  25 |     return (el.firstChild as HTMLElement).style.textAlign;
  26 |   });
  27 |   
  28 |   console.log("Text align is:", textAlign);
  29 |   expect(textAlign).toBe('left');
  30 | });
  31 | 
```