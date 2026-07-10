# مستندات نیازمندی‌های پروژه (Project Requirements)
**نام پروژه:** بای کالا (BuyKala Marketplace)
**معماری:** میکروسرویس یکپارچه (Monolithic Backend + SPA Frontend)

---

## ۱. نیازمندی‌های سطح سیستم (System Prerequisites)
برای اجرای صحیح کل چرخه نرم‌افزار، ابزارهای زیر باید روی سرور یا سیستم توسعه‌دهنده نصب باشند:

* **Java Development Kit (JDK):** نسخه 21 (توصیه شده: OpenJDK 21)
* **Node.js:** نسخه 18.0.0 یا بالاتر (همراه با `npm` نسخه 8+)
* **Docker & Docker Compose:** برای اجرای کانتینر ایزوله پایگاه داده
* **Web Browser:** گوگل کروم یا مایکروسافت ادج (برای اجرای تست‌های UI پلی‌رایت)

---

## ۲. نیازمندی‌های سمت سرور (Backend Dependencies)
هسته بک‌اند با فریم‌ورک **Spring Boot (نسخه 4.1.0)** توسعه یافته و کاملاً با ویژگی‌های جاوا 21 سازگار شده است. مدیریت وابستگی‌ها بر عهده `Maven` است. وابستگی‌های اصلی (`pom.xml`) عبارتند از:

* `spring-boot-starter-web`: برای ایجاد معماری RESTful API
* `spring-boot-starter-data-jpa`: برای پیاده‌سازی لایه ORM و اتصال به دیتابیس با Hibernate
* `postgresql`: درایور رسمی اتصال جاوا به دیتابیس PostgreSQL
* `spring-boot-starter-validation`: برای اعتبارسنجی ورودی‌های کاربر (مانند اعتبارسنجی طول دقیق شماره شبا)
* `lombok`: برای کاهش کدهای Boilerplate (تولید خودکار Getter/Setter و Builder)

---

## ۳. نیازمندی‌های سمت کاربر (Frontend Dependencies)
رابط کاربری به صورت Single Page Application با **React** نوشته شده و توسط `Vite` بیلد می‌شود. وابستگی‌های اصلی (`package.json`) عبارتند از:

* `react` (v18+): هسته اصلی فریم‌ورک ری‌اکت
* `react-dom` (v18+): برای رندر کردن کامپوننت‌ها در مرورگر
* `vite`: به عنوان Bundler و ابزار توسعه فوق‌سریع فرانت‌اند

> **نکته:** در این پروژه از هیچ کتابخانه استایل‌دهی خارجی (مثل Tailwind یا Bootstrap) استفاده نشده و تمامی استایل‌ها به صورت کدهای بومی (Inline CSS) و کاملاً مستقل پیاده‌سازی شده‌اند.

---

## ۴. نیازمندی‌های پایگاه داده (Database Specs)
* **پایگاه داده:** PostgreSQL (نسخه 15 یا بالاتر)
* **نحوه اجرا:** از طریق کانتینر داکر (Docker Engine)
* **پورت پیش‌فرض ارتباطی:** 5432

---

## ۵. نیازمندی‌های تست خودکار (QA & Testing)
برای شبیه‌سازی رفتار کاربران و اجرای سناریوهای سرتاسری (E2E) از ابزار قدرتمند شرکت مایکروسافت استفاده شده است:

* `@playwright/test`: فریم‌ورک تست‌نویسی
* **شبیه‌سازهای مرورگر:** موتورهای Chromium, Firefox, WebKit (قابل نصب از طریق `npx playwright install`)


برای اجرای کل بخش‌های پروژه (دیتابیس، بک‌اند، فرانت‌اند و تست‌ها)، تمام دستوراتی که باید در ترمینال‌های مجزا بزنید به این ترتیب است:

### ۱. راه‌اندازی دیتابیس (در پوشه اصلی پروژه)

```bash
docker-compose up -d

```

### ۲. اجرای بک‌اند (Spring Boot)

```bash
cd backend

# برای ویندوز:
mvnw.cmd spring-boot:run

# برای مک / لینوکس:
./mvnw spring-boot:run

```

### ۳. اجرای فرانت‌اند (React)

```bash
cd frontend
npm install
npm run dev

```

### ۴. اجرای تست‌های خودکار (Playwright)

```bash
cd e2e-tests
npm install
npx playwright install
npx playwright test --ui

```

### ۵. متوقف کردن و خاموش کردن کامل سیستم

```bash
docker-compose down

```
