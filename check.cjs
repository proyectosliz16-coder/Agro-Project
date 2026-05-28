const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER_ERROR:', err.toString()));
  page.on('requestfailed', request => {
    console.log('REQUEST_FAILED:', request.url(), request.failure() ? request.failure().errorText : request.response().status());
  });
  await page.goto('http://localhost:5173/');
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();
