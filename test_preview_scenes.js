const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

async function testScreenshots() {
  const server = http.createServer((req, res) => {
    let reqPath = req.url === '/' ? '/index.html' : req.url.split('?')[0];
    let fullPath = path.join(__dirname, reqPath);
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      fs.createReadStream(fullPath).pipe(res);
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  await new Promise(r => server.listen(8091, r));

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1920,1080']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await page.goto('http://localhost:8091/index.html', { waitUntil: 'networkidle0' });

  await page.evaluate(() => {
    document.body.classList.add('export-mode');
    if (window.timeline) {
      window.timeline.pause();
    }
  });

  const checkTimes = [
    { name: 'trans1_10s.jpg', t: 10.0 },
    { name: 'trans2_22s.jpg', t: 22.0 },
    { name: 'trans3_40s.jpg', t: 40.0 },
    { name: 'trans4_50s.jpg', t: 50.0 },
    { name: 'scene5_thanh_51s.jpg', t: 51.5 },
    { name: 'scene5_hoai_anh_54s.jpg', t: 54.5 },
    { name: 'scene5_formation_58s.jpg', t: 58.0 }
  ];

  for (let item of checkTimes) {
    await page.evaluate((time) => {
      window.timeline.seek(time);
    }, item.t);

    await page.screenshot({ path: item.name, type: 'jpeg', quality: 90 });
    console.log(`Captured: ${item.name} at ${item.t}s`);
  }

  await browser.close();
  server.close();
  console.log('All test previews captured!');
}

testScreenshots().catch(console.error);
