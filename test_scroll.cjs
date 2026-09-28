const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.goto('https://darshohri.vercel.app');
  await new Promise(r => setTimeout(r, 6000));
  await page.mouse.wheel({deltaY: 500});
  await new Promise(r => setTimeout(r, 1000));
  const scrollPos = await page.evaluate(() => {
    let scrollable = null;
    for(let el of document.querySelectorAll('*')) {
      if (el.style.overflow === 'auto' || el.style.overflowY === 'auto' || el.style.overflowY === 'scroll') {
        scrollable = el;
        break;
      }
    }
    return scrollable ? scrollable.scrollTop : -1;
  });
  console.log('ScrollTop is:', scrollPos);
  await browser.close();
})();
