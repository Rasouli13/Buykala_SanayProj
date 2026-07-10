const { test, expect } = require('@playwright/test');

test('should execute full marketplace workflow: Vendor -> Admin -> Product -> Customer', async ({ page }) => {
  // ۱. تولید شناسه‌های کاملاً یکتا برای جلوگیری از خطای تکراری بودن در دیتابیس
  const timestamp = Date.now().toString().slice(-7); // دقیقاً ۷ رقم
  const vendorPhone = `0912${timestamp}`;   // 4 + 7 = 11 رقم
  const adminPhone = `0999${timestamp}`;    // 4 + 7 = 11 رقم
  const customerPhone = `0911${timestamp}`; // 4 + 7 = 11 رقم

  // ۲. تولید دیتای یکتا برای فرم‌ها
  const uniqueShopName = `ایران تکنولوژی ${timestamp}`;
  // شبا باید دقیقاً ۲۶ کاراکتر باشد: IR (2) + timestamp (7) + 12345678901234567 (17) = 26
  const uniqueShaba = `IR${timestamp}12345678901234567`; 
  const uniqueCategory = `دیجیتال ${timestamp}`;
  const uniqueProduct = `گوشی آیفون ۱۳ ${timestamp}`;

  // -------------------------------------------------------------------------
  // مرحله ۱: ثبت‌نام فروشنده و ساخت غرفه
  // -------------------------------------------------------------------------
  await page.goto('http://localhost:5173');
  
  await page.getByPlaceholder('مثال: 09123456789').fill(vendorPhone);
  await page.getByPlaceholder('رمز عبور خود را وارد کنید').fill('vendorPass123');
  await page.locator('select').selectOption('VENDOR');
  await page.getByRole('button', { name: 'ورود / ثبت‌نام' }).click();

  await page.getByRole('button', { name: 'پنل غرفه‌دار' }).click();
  await page.getByPlaceholder('نام غرفه').fill(uniqueShopName);
  await page.getByPlaceholder('شماره شبا (۲۶ رقم همراه با IR)').fill(uniqueShaba);
  await page.getByRole('button', { name: 'ثبت و ارسال به ادمین' }).click();

  // تایید پیام فارسی
  await expect(page.locator('body')).toContainText('وضعیت غرفه: در انتظار تایید ادمین ⏳', { timeout: 10000 });
  await page.getByRole('button', { name: 'خروج' }).click();

  // -------------------------------------------------------------------------
  // مرحله ۲: ورود ادمین، ساخت دسته‌بندی یکتا و تایید غرفه
  // -------------------------------------------------------------------------
  await page.getByPlaceholder('مثال: 09123456789').fill(adminPhone);
  await page.getByPlaceholder('رمز عبور خود را وارد کنید').fill('adminPass123');
  await page.locator('select').selectOption('ADMIN');
  await page.getByRole('button', { name: 'ورود / ثبت‌نام' }).click();

  // جلوگیری از ارور تکراری بودن دسته‌بندی
  await page.getByPlaceholder('نام دسته‌بندی جدید (مثلا: آرایشی)').fill(uniqueCategory);
  await page.getByRole('button', { name: 'ساخت دسته‌بندی' }).click();
  await expect(page.locator('body')).toContainText('دسته‌بندی جدید با موفقیت در سیستم ثبت شد.');

  // تایید دینامیک غرفه‌ای که در مرحله ۱ ساختیم
  const approveButton = page.locator(`tr:has-text("${uniqueShopName}")`).getByRole('button', { name: 'تایید' });
  await approveButton.click();
  await expect(page.locator(`tr:has-text("${uniqueShopName}")`)).toContainText('APPROVED');
  await page.getByRole('button', { name: 'خروج' }).click();

  // -------------------------------------------------------------------------
  // مرحله ۳: افزودن کالا توسط غرفه‌دار
  // -------------------------------------------------------------------------
  await page.getByPlaceholder('مثال: 09123456789').fill(vendorPhone);
  await page.getByPlaceholder('رمز عبور خود را وارد کنید').fill('vendorPass123');
  await page.locator('select').selectOption('VENDOR');
  await page.getByRole('button', { name: 'ورود / ثبت‌نام' }).click();

  await page.getByRole('button', { name: 'پنل غرفه‌دار' }).click();
  await expect(page.locator('body')).toContainText('افزودن کالا به غرفه'); // اطمینان از لود فرم

  await page.getByPlaceholder('نام کالا').fill(uniqueProduct);
  await page.getByPlaceholder('توضیحات اجمالی').fill('حافظه ۱۲۸ گیگابایت');
  
  // برای فیلدهای input type="number" فقط از اعداد انگلیسی استفاده کنید
  await page.getByPlaceholder('قیمت (تومان)').fill('45000000'); 
  await page.getByPlaceholder('موجودی انبار').fill('10');
  await page.getByRole('button', { name: 'تایید و انتشار کالا' }).click();

  await expect(page.locator(`tr:has-text("${uniqueProduct}")`)).toBeVisible();
  await page.getByRole('button', { name: 'خروج' }).click();

  // -------------------------------------------------------------------------
  // مرحله ۴: ورود مشتری و ثبت نهایی سفارش
  // -------------------------------------------------------------------------
  await page.getByPlaceholder('مثال: 09123456789').fill(customerPhone);
  await page.getByPlaceholder('رمز عبور خود را وارد کنید').fill('customerPass123');
  await page.locator('select').selectOption('CUSTOMER');
  await page.getByRole('button', { name: 'ورود / ثبت‌نام' }).click();

  await page.getByRole('button', { name: 'صفحه اصلی' }).click();
  await expect(page.locator('body')).toContainText(uniqueProduct);

  // کلیک روی دکمه سبد خریدِ مختص به همین کالای تولید شده
  const productCard = page.locator(`div:has(> div > h4:text-is("${uniqueProduct}"))`);
  await productCard.getByRole('button', { name: 'افزودن به سبد' }).click();
  await expect(page.locator('body')).toContainText('کالا با موفقیت به سبد خرید اضافه شد');

  await page.getByRole('button', { name: 'سبد خرید' }).click();
  await page.getByPlaceholder('شهر').fill('تهران');
  await page.getByPlaceholder('کد پستی').fill('1111122222');
  await page.getByPlaceholder('آدرس دقیق پستی').fill('خیابان آزادی، کوچه مریم، پلاک ۴');
  await page.getByRole('button', { name: 'تایید و پرداخت نهایی' }).click();

  // تایید نهایی چرخه‌ی خرید
  await expect(page.locator('body')).toContainText('سفارش شما با موفقیت ثبت و پرداخت شد!', { timeout: 10000 });
});