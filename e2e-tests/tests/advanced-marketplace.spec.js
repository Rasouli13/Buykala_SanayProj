const { test, expect } = require('@playwright/test');

test.describe('BuyKala Advanced & Edge-Case Testing Suite', () => {
  let timestamp;
  let vendorPhone, adminPhone, customerPhone;
  let uniqueShopName, uniqueShaba, uniqueCategory, uniqueProduct;

  // Initialize unique data before each test to ensure clean state
  test.beforeEach(() => {
    timestamp = Date.now().toString().slice(-7);
    vendorPhone = `0912${timestamp}`;
    adminPhone = `0999${timestamp}`;
    customerPhone = `0911${timestamp}`;

    uniqueShopName = `غرفه پیشرفته ${timestamp}`;
    uniqueShaba = `IR${timestamp}12345678901234567`;
    uniqueCategory = `تکنولوژی ${timestamp}`;
    uniqueProduct = `کالای لیمیتد ${timestamp}`;
  });

  // -------------------------------------------------------------------------
  // ADVANCED TEST 1: Stock Boundary Validation & Out-Of-Stock UI Triggers
  // -------------------------------------------------------------------------
  test('should enforce stock limits and change button to Out-of-Stock when stock hits 0', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.getByPlaceholder('مثال: 09123456789').fill(vendorPhone);
    await page.getByPlaceholder('رمز عبور خود را وارد کنید').fill('password123');
    await page.locator('select').selectOption('VENDOR');
    await page.getByRole('button', { name: 'ورود / ثبت‌نام' }).click();

    await page.getByRole('button', { name: 'پنل غرفه‌دار' }).click();
    await page.getByPlaceholder('نام غرفه').fill(uniqueShopName);
    await page.getByPlaceholder('شماره شبا (۲۶ رقم همراه با IR)').fill(uniqueShaba);
    await page.getByRole('button', { name: 'ثبت و ارسال به ادمین' }).click();
    
    await expect(page.locator('body')).toContainText('وضعیت غرفه: در انتظار تایید ادمین ⏳', { timeout: 10000 });
    await page.getByRole('button', { name: 'خروج' }).click();

    await page.getByPlaceholder('مثال: 09123456789').fill(adminPhone);
    await page.getByPlaceholder('رمز عبور خود را وارد کنید').fill('password123');
    await page.locator('select').selectOption('ADMIN');
    await page.getByRole('button', { name: 'ورود / ثبت‌نام' }).click();

    await page.getByPlaceholder('نام دسته‌بندی جدید (مثلا: آرایشی)').fill(uniqueCategory);
    await page.getByRole('button', { name: 'ساخت دسته‌بندی' }).click();
    await page.locator(`tr:has-text("${uniqueShopName}")`).getByRole('button', { name: 'تایید' }).click();
    await page.getByRole('button', { name: 'خروج' }).click();

    await page.getByPlaceholder('مثال: 09123456789').fill(vendorPhone);
    await page.getByPlaceholder('رمز عبور خود را وارد کنید').fill('password123');
    await page.locator('select').selectOption('VENDOR');
    await page.getByRole('button', { name: 'ورود / ثبت‌نام' }).click();

    await page.getByRole('button', { name: 'پنل غرفه‌دار' }).click();
    await page.getByPlaceholder('نام کالا').fill(uniqueProduct);
    await page.getByPlaceholder('قیمت (تومان)').fill('10000');
    await page.getByPlaceholder('موجودی انبار').fill('1'); // Setting stock to 1
    await page.getByRole('button', { name: 'تایید و انتشار کالا' }).click();
    await page.getByRole('button', { name: 'خروج' }).click();

    await page.getByPlaceholder('مثال: 09123456789').fill(customerPhone);
    await page.getByPlaceholder('رمز عبور خود را وارد کنید').fill('password123');
    await page.locator('select').selectOption('CUSTOMER');
    await page.getByRole('button', { name: 'ورود / ثبت‌نام' }).click();

    await page.getByRole('button', { name: 'صفحه اصلی' }).click();
    const productCard = page.locator(`div:has(> div > h4:text-is("${uniqueProduct}"))`);
    await productCard.getByRole('button', { name: 'افزودن به سبد' }).click();

    await page.getByRole('button', { name: 'سبد خرید' }).click();
    await page.getByPlaceholder('شهر').fill('اصفهان');
    await page.getByPlaceholder('کد پستی').fill('5555566666');
    await page.getByPlaceholder('آدرس دقیق پستی').fill('بلوار دانشگاه، مجتمع نگین');
    await page.getByRole('button', { name: 'تایید و پرداخت نهایی' }).click();
    await expect(page.locator('body')).toContainText('سفارش شما با موفقیت ثبت و پرداخت شد!');

    await page.getByRole('button', { name: 'صفحه اصلی' }).click();
    const updatedProductCard = page.locator(`div:has(> div > h4:text-is("${uniqueProduct}"))`);
    await expect(updatedProductCard.getByRole('button')).toHaveText('ناموجود');
    await expect(updatedProductCard.getByRole('button')).toBeDisabled();
  });

  // -------------------------------------------------------------------------
  // ADVANCED TEST 2: Role-Based UI Security & Authorization Isolation
  // -------------------------------------------------------------------------
  test('should strictly isolate user roles and restrict unauthorized view components', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.getByPlaceholder('مثال: 09123456789').fill(customerPhone);
    await page.getByPlaceholder('رمز عبور خود را وارد کنید').fill('password123');
    await page.locator('select').selectOption('CUSTOMER');
    await page.getByRole('button', { name: 'ورود / ثبت‌نام' }).click();

    await expect(page.getByRole('button', { name: 'پنل مدیریت' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'پنل غرفه‌دار' })).not.toBeVisible();

    await page.evaluate(() => { window.location.hash = 'admin'; });
    await expect(page.locator('body')).not.toContainText('مدیریت کاتالوگ و دسته‌بندی');
  });

  // -------------------------------------------------------------------------
  // ADVANCED TEST 3: Network Interception & Graceful Error Handling
  // -------------------------------------------------------------------------
  test('should gracefully handle backend 500 errors using network interception', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.getByPlaceholder('مثال: 09123456789').fill(customerPhone);
    await page.getByPlaceholder('رمز عبور خود را وارد کنید').fill('password123');
    await page.locator('select').selectOption('CUSTOMER');
    await page.getByRole('button', { name: 'ورود / ثبت‌نام' }).click();
    await page.getByRole('button', { name: 'صفحه اصلی' }).click();

    await page.route('**/api/cart', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'ارتباط با سرور قطع شد. لطفاً مجدداً تلاش کنید.' }),
      });
    });

    const firstAddToCartButton = page.getByRole('button', { name: 'افزودن به سبد' }).first();
    await firstAddToCartButton.click();
    await expect(page.locator('body')).toContainText('ارتباط با سرور قطع شد. لطفاً مجدداً تلاش کنید.');
    await page.unroute('**/api/cart');
  });

 // -------------------------------------------------------------------------
  // ADVANCED TEST 4: Stock Overflow Prevention (Adding more than available)
  // -------------------------------------------------------------------------
  test('should prevent user from adding more items to cart than available in stock', async ({ page }) => {
    const overflowProduct = `کالای کمیاب ${Date.now()}`;

    // ۱. آماده‌سازی: ثبت غرفه جدید و تایید توسط ادمین
    await page.goto('http://localhost:5173');
    await page.getByPlaceholder('مثال: 09123456789').fill(vendorPhone);
    await page.getByPlaceholder('رمز عبور خود را وارد کنید').fill('password123');
    await page.locator('select').selectOption('VENDOR');
    await page.getByRole('button', { name: 'ورود / ثبت‌نام' }).click();
    await page.getByRole('button', { name: 'پنل غرفه‌دار' }).click();
    await page.getByPlaceholder('نام غرفه').fill(uniqueShopName);
    await page.getByPlaceholder('شماره شبا (۲۶ رقم همراه با IR)').fill(uniqueShaba);
    await page.getByRole('button', { name: 'ثبت و ارسال به ادمین' }).click();
    await expect(page.locator('body')).toContainText('وضعیت غرفه: در انتظار تایید ادمین ⏳', { timeout: 10000 });
    await page.getByRole('button', { name: 'خروج' }).click();

    await page.getByPlaceholder('مثال: 09123456789').fill(adminPhone);
    await page.getByPlaceholder('رمز عبور خود را وارد کنید').fill('password123');
    await page.locator('select').selectOption('ADMIN');
    await page.getByRole('button', { name: 'ورود / ثبت‌نام' }).click();
    await page.getByPlaceholder('نام دسته‌بندی جدید (مثلا: آرایشی)').fill(uniqueCategory);
    await page.getByRole('button', { name: 'ساخت دسته‌بندی' }).click();
    await page.locator(`tr:has-text("${uniqueShopName}")`).getByRole('button', { name: 'تایید' }).click();
    await page.getByRole('button', { name: 'خروج' }).click();

    // ۲. ورود مجدد غرفه‌دار و ساخت کالایی با موجودی دقیقا ۲ عدد
    await page.getByPlaceholder('مثال: 09123456789').fill(vendorPhone);
    await page.getByPlaceholder('رمز عبور خود را وارد کنید').fill('password123');
    await page.locator('select').selectOption('VENDOR');
    await page.getByRole('button', { name: 'ورود / ثبت‌نام' }).click();

    await page.getByRole('button', { name: 'پنل غرفه‌دار' }).click();
    await expect(page.locator('body')).toContainText('افزودن کالا به غرفه'); // اطمینان از باز شدن فرم
    await page.getByPlaceholder('نام کالا').fill(overflowProduct);
    await page.getByPlaceholder('قیمت (تومان)').fill('50000');
    await page.getByPlaceholder('موجودی انبار').fill('2'); // مرز: فقط ۲ عدد
    await page.getByRole('button', { name: 'تایید و انتشار کالا' }).click();
    await page.getByRole('button', { name: 'خروج' }).click();

    // ۳. ورود مشتری به سیستم
    await page.getByPlaceholder('مثال: 09123456789').fill(customerPhone);
    await page.getByPlaceholder('رمز عبور خود را وارد کنید').fill('password123');
    await page.locator('select').selectOption('CUSTOMER');
    await page.getByRole('button', { name: 'ورود / ثبت‌نام' }).click();
    await page.getByRole('button', { name: 'صفحه اصلی' }).click();

    // ۴. تلاش برای ۳ بار کلیک روی دکمه (بیشتر از ظرفیت انبار)
    const productCard = page.locator(`div:has(> div > h4:text-is("${overflowProduct}"))`);
    const addButton = productCard.getByRole('button', { name: 'افزودن به سبد' });

    await addButton.click(); // کلیک اول (موفق)
    await expect(page.locator('body')).toContainText('کالا با موفقیت به سبد خرید اضافه شد');
    
    await addButton.click(); // کلیک دوم (موفق)
    
    // کلیک سوم (عبور از مرز) - اینجا باید خطا بگیریم!
    await addButton.click(); 
    await expect(page.locator('body')).toContainText('خطا', { timeout: 5000 }); 
  });


  // -------------------------------------------------------------------------
  // ADVANCED TEST 5: Empty Cart Checkout Prevention (Ghost Cart)
  // -------------------------------------------------------------------------
  test('should prevent checkout process when the cart is empty', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.getByPlaceholder('مثال: 09123456789').fill(customerPhone);
    await page.getByPlaceholder('رمز عبور خود را وارد کنید').fill('password123');
    await page.locator('select').selectOption('CUSTOMER');
    await page.getByRole('button', { name: 'ورود / ثبت‌نام' }).click();

    // کاربر بدون انتخاب کالا مستقیماً به سبد خرید می‌رود
    await page.getByRole('button', { name: 'سبد خرید' }).click();

    // راستی‌آزمایی اینکه سیستم پیام سبد خالی را نشان می‌دهد
    await expect(page.locator('body')).toContainText('سبد خرید شما در حال حاضر خالی است.');

    // راستی‌آزمایی اینکه فرم آدرس و دکمه پرداخت اصلاً وجود ندارند
    await expect(page.getByRole('button', { name: 'تایید و پرداخت نهایی' })).not.toBeVisible();
    await expect(page.getByPlaceholder('آدرس دقیق پستی')).not.toBeVisible();
  });

  // -------------------------------------------------------------------------
  // ADVANCED TEST 6: Race Condition (Concurrent Checkout for Last Item)
  // -------------------------------------------------------------------------
  test('should handle race conditions when two users try to buy the last item', async ({ browser }) => {
    const raceCustomerA = `0911${Date.now().toString().slice(-6)}1`;
    const raceCustomerB = `0911${Date.now().toString().slice(-6)}2`;
    const raceProduct = `آیفون آخرین عدد ${Date.now()}`;

    const contextA = await browser.newContext();
    const pageA = await contextA.newPage();

    // ۱. آماده‌سازی: ثبت غرفه، تایید ادمین و ثبت کالا در pageA
    await pageA.goto('http://localhost:5173');
    await pageA.getByPlaceholder('مثال: 09123456789').fill(vendorPhone);
    await pageA.getByPlaceholder('رمز عبور خود را وارد کنید').fill('password123');
    await pageA.locator('select').selectOption('VENDOR');
    await pageA.getByRole('button', { name: 'ورود / ثبت‌نام' }).click();
    await pageA.getByRole('button', { name: 'پنل غرفه‌دار' }).click();
    await pageA.getByPlaceholder('نام غرفه').fill(uniqueShopName);
    await pageA.getByPlaceholder('شماره شبا (۲۶ رقم همراه با IR)').fill(uniqueShaba);
    await pageA.getByRole('button', { name: 'ثبت و ارسال به ادمین' }).click();
    await expect(pageA.locator('body')).toContainText('وضعیت غرفه: در انتظار تایید ادمین ⏳', { timeout: 10000 });
    await pageA.getByRole('button', { name: 'خروج' }).click();

    await pageA.getByPlaceholder('مثال: 09123456789').fill(adminPhone);
    await pageA.getByPlaceholder('رمز عبور خود را وارد کنید').fill('password123');
    await pageA.locator('select').selectOption('ADMIN');
    await pageA.getByRole('button', { name: 'ورود / ثبت‌نام' }).click();
    await pageA.getByPlaceholder('نام دسته‌بندی جدید (مثلا: آرایشی)').fill(uniqueCategory);
    await pageA.getByRole('button', { name: 'ساخت دسته‌بندی' }).click();
    await pageA.locator(`tr:has-text("${uniqueShopName}")`).getByRole('button', { name: 'تایید' }).click();
    await pageA.getByRole('button', { name: 'خروج' }).click();

    await pageA.getByPlaceholder('مثال: 09123456789').fill(vendorPhone);
    await pageA.getByPlaceholder('رمز عبور خود را وارد کنید').fill('password123');
    await pageA.locator('select').selectOption('VENDOR');
    await pageA.getByRole('button', { name: 'ورود / ثبت‌نام' }).click();
    await pageA.getByRole('button', { name: 'پنل غرفه‌دار' }).click();
    
    // اکنون فرم "افزودن کالا" در دسترس است
    await pageA.getByPlaceholder('نام کالا').fill(raceProduct);
    await pageA.getByPlaceholder('قیمت (تومان)').fill('100000');
    await pageA.getByPlaceholder('موجودی انبار').fill('1'); // فقط ۱ عدد موجود است!
    await pageA.getByRole('button', { name: 'تایید و انتشار کالا' }).click();
    await pageA.getByRole('button', { name: 'خروج' }).click();

    const contextB = await browser.newContext();
    const pageB = await contextB.newPage();

    // ۲. مشتری الف وارد می‌شود
    await pageA.getByPlaceholder('مثال: 09123456789').fill(raceCustomerA);
    await pageA.getByPlaceholder('رمز عبور خود را وارد کنید').fill('passA');
    await pageA.locator('select').selectOption('CUSTOMER');
    await pageA.getByRole('button', { name: 'ورود / ثبت‌نام' }).click();
    await pageA.getByRole('button', { name: 'صفحه اصلی' }).click();
    await pageA.locator(`div:has(> div > h4:text-is("${raceProduct}"))`).getByRole('button', { name: 'افزودن به سبد' }).click();
    await expect(pageA.locator('body')).toContainText('کالا با موفقیت به سبد خرید اضافه شد');

    // ۳. مشتری ب همزمان وارد می‌شود
    await pageB.goto('http://localhost:5173');
    await pageB.getByPlaceholder('مثال: 09123456789').fill(raceCustomerB);
    await pageB.getByPlaceholder('رمز عبور خود را وارد کنید').fill('passB');
    await pageB.locator('select').selectOption('CUSTOMER');
    await pageB.getByRole('button', { name: 'ورود / ثبت‌نام' }).click();
    await pageB.getByRole('button', { name: 'صفحه اصلی' }).click();
    await pageB.locator(`div:has(> div > h4:text-is("${raceProduct}"))`).getByRole('button', { name: 'افزودن به سبد' }).click();
    await expect(pageB.locator('body')).toContainText('کالا با موفقیت به سبد خرید اضافه شد');

    // ۴. هر دو به صفحه پرداخت می‌روند
    await pageA.getByRole('button', { name: 'سبد خرید' }).click();
    await pageA.getByPlaceholder('شهر').fill('City A');
    await pageA.getByPlaceholder('کد پستی').fill('1111111111');
    await pageA.getByPlaceholder('آدرس دقیق پستی').fill('Address A');

    await pageB.getByRole('button', { name: 'سبد خرید' }).click();
    await pageB.getByPlaceholder('شهر').fill('City B');
    await pageB.getByPlaceholder('کد پستی').fill('2222222222');
    await pageB.getByPlaceholder('آدرس دقیق پستی').fill('Address B');

    // ۵. آغاز رقابت همزمان
    const checkoutA = pageA.getByRole('button', { name: 'تایید و پرداخت نهایی' }).click();
    const checkoutB = pageB.getByRole('button', { name: 'تایید و پرداخت نهایی' }).click();
    await Promise.all([checkoutA, checkoutB]);

    // ۶. راستی‌آزمایی (حداکثر یک نفر موفق می‌شود)
    const textA = await pageA.locator('body').innerText();
    const textB = await pageB.locator('body').innerText();

    const aSuccess = textA.includes('سفارش شما با موفقیت ثبت و پرداخت شد!');
    const bSuccess = textB.includes('سفارش شما با موفقیت ثبت و پرداخت شد!');

    expect(aSuccess && bSuccess).toBe(false); 

    await contextA.close();
    await contextB.close();
  });
});