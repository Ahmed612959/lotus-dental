# 🦷 Lotus Dental Care — منصة عيادة لوتس لطب الأسنان

منصة ويب كاملة (Full-Stack) لعيادة أسنان، ثنائية اللغة (عربي/إنجليزي)، مبنية بالكامل عشان تتنشر على **Vercel** — الفرونت إند والباك إند مع بعض في نفس المشروع، بدون الحاجة لأي سيرفر منفصل.

## هيكل المشروع

```
lotus-dental/
├── api/          ← Backend (Vercel Serverless Functions)
│   ├── _lib/     ← موديلز، اتصال قاعدة البيانات، أدوات المصادقة (مش endpoints، بادئة _ بتخليها مستثناة)
│   ├── auth/
│   ├── doctors/
│   ├── services/
│   ├── appointments/
│   ├── patients/
│   ├── settings/
│   └── testimonials/
├── client/       ← Frontend (React + Vite + Tailwind)
├── scripts/
│   └── seed.js   ← بيانات تجريبية
├── vercel.json   ← إعدادات النشر
└── package.json  ← اعتماديات الـ API (الجذر)
```

**ليه المعمارية دي؟** Vercel بيحوّل أي ملف `.js` جوه `/api` تلقائيًا لـ endpoint مستقل (serverless function) — مفيش حاجة اسمها سيرفر شغال باستمرار زي Express، كل request بيشغّل الدالة المطلوبة بس وقتها. ده معناه الفرونت إند والباك إند بينشروا مع بعض من **نفس الـ repo** على **نفس الدومين**، من غير أي إعداد CORS معقد أو رابط باك إند منفصل.

---

## 1) قاعدة البيانات — MongoDB Atlas (مجاني)

1. روح [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) واعمل حساب مجاني
2. اعمل Cluster مجاني (M0)
3. من **Database Access** اعمل مستخدم بباسورد
4. من **Network Access** اضغط **Allow access from anywhere** (0.0.0.0/0) — ضروري لأن Vercel بيشغّل من IPs متغيرة
5. من **Connect → Drivers** خد الـ connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/lotus_dental_care
   ```

---

## 2) رفع المشروع على GitHub

جوه مجلد المشروع (اللي فيه `api` و`client` مع بعض):

```bash
git init
git add .
git commit -m "Initial commit - Lotus Dental Care platform"
```

اعمل repo فاضي جديد على GitHub (من غير README)، بعدين:

```bash
git remote add origin https://github.com/USERNAME/lotus-dental-care.git
git branch -M main
git push -u origin main
```

---

## 3) النشر على Vercel

1. روح [vercel.com](https://vercel.com) وسجل بحساب GitHub
2. **Add New** → **Project** → اختار الـ repo بتاعك
3. **مهم:** سيب **Root Directory** على القيمة الافتراضية (جذر المشروع، مش `client`) — لأن `vercel.json` في الجذر هو اللي بيوجّه البناء لمجلد `client` تلقائيًا ويكتشف مجلد `api` بنفسه
4. في **Environment Variables** ضيف المتغيرات دي (لكل البيئات: Production, Preview, Development):
   ```
   MONGO_URI     = (رابط MongoDB Atlas اللي أخدته فوق)
   JWT_SECRET    = (أي نص عشوائي طويل وسري - مثال: افتح https://generate-secret.vercel.app/32)
   JWT_EXPIRES_IN = 7d
   CLIENT_URL    = https://your-project-name.vercel.app
   ```
   > ملحوظة: أول مرة مش هتعرف رابط Vercel قبل النشر. اعمل Deploy الأول بأي قيمة مؤقتة لـ `CLIENT_URL`، وبعد ما ياخد الرابط الفعلي، ارجع للإعدادات وحدّثها، ثم اعمل **Redeploy**.
5. اضغط **Deploy** — هياخد دقيقة أو اتنين

---

## 4) تعبئة قاعدة البيانات ببيانات تجريبية (Seed)

الـ seed سكريبت بيتصل مباشرة بـ MongoDB Atlas، فتقدر تشغّله من جهازك محليًا (أسهل حل):

```bash
git clone https://github.com/USERNAME/lotus-dental-care.git
cd lotus-dental-care
npm install
echo "MONGO_URI=<رابط الأطلس بتاعك>" > .env
npm run seed
```

هيطبعلك في الآخر بيانات دخول الأدمن:
```
email: admin@lotusdental.com
password: Admin@123
```
**⚠️ غيّر الباسورد ده فورًا بعد أول تسجيل دخول** (من قاعدة البيانات مباشرة أو بإضافة endpoint لتغيير الباسورد لاحقًا).

---

## 5) التطوير محليًا (قبل الرفع)

بما إن الباك إند بقى serverless functions، أسهل طريقة للتجربة المحلية هي استخدام **Vercel CLI** اللي بيشغّل الفرونت إند والـ API مع بعض بنفس طريقة الإنتاج بالظبط:

```bash
npm install -g vercel
cd lotus-dental        # جذر المشروع
vercel dev
```

هيسألك تربط المشروع بحساب Vercel (لو أول مرة)، وهيشتغل على `http://localhost:3000` بيخدم الفرونت إند والـ API مع بعض. لازم يكون عندك ملف `.env` في الجذر فيه `MONGO_URI` و`JWT_SECRET` قبل ما تشغّله.

---

## هيكل قاعدة البيانات (Collections)

| Collection | الوصف |
|---|---|
| `users` | حسابات الأدمن / الاستقبال / الأطباء (بصلاحيات مختلفة) |
| `doctors` | بيانات الأطباء + جدول العمل الأسبوعي |
| `services` | الخدمات المقدمة (تنظيف، تقويم، زراعة...) |
| `patients` | بيانات المرضى (تُنشأ تلقائيًا عند أول حجز برقم موبايل) |
| `appointments` | الحجوزات - يحتوي فهرس فريد يمنع الحجز المزدوج |
| `settings` | إعدادات العيادة العامة (ساعات عمل، عنوان، إجازات) |
| `testimonials` | آراء المرضى المعروضة في الصفحة الرئيسية |

---

## أدوار المستخدمين (Roles)

- **admin**: صلاحية كاملة على كل شيء
- **receptionist**: يدير المواعيد والمرضى، لا يدير الأطباء/الخدمات/الإعدادات
- **doctor**: يشوف مواعيده هو فقط (لازم يتربط بحساب `Doctor` عن طريق `doctor` field في الـ User)

لإنشاء حساب موظف/طبيب جديد، استخدم `POST /api/auth/register` وأنت مسجل دخول كـ admin.

---

## نظام منع تعارض المواعيد

الحجز محمي على مستويين:
1. **منطقيًا**: عند طلب الحجز، السيرفر بيعيد حساب الأوقات المتاحة فعليًا (`api/_lib/slotCalculator.js`) ويتأكد إن الوقت المطلوب لسه متاح.
2. **على مستوى قاعدة البيانات**: فهرس فريد (`unique index`) على `{doctor, date, startTime}` بيمنع نهائيًا حفظ حجزين في نفس اللحظة، حتى لو حصل تعارض بالتوقيت (Race Condition).

---

## أداء قاعدة البيانات في بيئة Serverless

`api/_lib/dbConnect.js` بيعمل **cache** للاتصال بـ MongoDB على مستوى الـ process، عشان الاتصال الجديد يتفتح مرة واحدة بس لكل "container دافئ" مش مع كل request — ده ضروري في بيئة serverless عشان منستهلكش حد الاتصالات المسموح بيه في خطة MongoDB Atlas المجانية.

**ملحوظة عن الطبقة المجانية:** Cluster الـ M0 المجاني من MongoDB Atlas ممكن ياخد ثواني إضافية في أول طلب بعد فترة عدم استخدام (تشبه فكرة "الاستيقاظ من النوم"). ده طبيعي في الخطط المجانية ومقبول لمرحلة الـ MVP/العرض التجريبي.

---

## نقاط تحتاج ربط لاحقًا (خارج نطاق هذا الكود)

1. **إشعارات SMS/WhatsApp**: مكان الإضافة موضح بتعليق `NOTE` داخل `api/appointments/index.js` (دالة `createAppointment`). يُفضّل استخدام Twilio.
2. **إرسال فورم التواصل بإيميل حقيقي**: صفحة `client/src/pages/Contact.jsx` حاليًا بتحاكي الإرسال؛ يحتاج endpoint فعلي جديد `api/contact.js` مع خدمة إيميل (Resend، SendGrid، إلخ).
3. **خريطة Google Maps**: أضف رابط الـ embed في قاعدة البيانات (`Settings.mapEmbedUrl`) — الحقل موجود بالفعل بالموديل.
4. **رفع صور الأطباء/الخدمات**: حاليًا الحقل `photo`/`image` عبارة عن رابط نصي (URL) تحطه يدويًا. لإضافة رفع فعلي للصور، الخيار الأنسب مع Vercel هو **Vercel Blob** أو **Cloudinary**.

---

## استكشاف الأخطاء الشائعة

- **"MONGO_URI environment variable is not set"** → تأكد إنك ضفت المتغير في Vercel Project Settings → Environment Variables، وعملت Redeploy بعدها.
- **مشاكل CORS بعد النشر** → تأكد إن `CLIENT_URL` في متغيرات البيئة مطابق تمامًا لرابط الفرونت إند الفعلي على Vercel (بدون `/` في الآخر).
- **الحجز بياخد وقت طويل في أول محاولة** → طبيعي، ده تأخير "استيقاظ" قاعدة البيانات المجانية من Atlas، مش مشكلة في الكود.
