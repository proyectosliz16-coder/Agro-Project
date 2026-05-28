const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  
  // click "Logística" tab (assuming it has text 'Logística' or something)
  // Let's just wait and take a screenshot of the default view
  await page.screenshot({ path: 'screenshot.png' });
  
  await browser.close();
})();
