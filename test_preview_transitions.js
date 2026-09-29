const puppeteer = require('puppeteer-core');
const http = require('http');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function capture() {
  const server = http.createServer((req, res) => {
    let reqPath = req.url === '/' ? '/index.html' : req.url.split('?')[0];
    let fullPath = path.join(__dirname, reqPath);
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      const ext = path.extname(fullPath).toLowerCase();
      const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.jpg': 'image/jpeg',
        '.png': 'image/png',
        '.svg': 'image/svg+xml'
      };
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      fs.createReadStream(fullPath).pipe(res);
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  await new Promise(r => server.listen(0, r));
  const port = server.address().port;

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1920,1080']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await page.goto(`http://localhost:${port}/index.html`, { waitUntil: 'networkidle0' });

  await page.evaluate(() => {
    document.body.classList.add('export-mode');
    if (window.sceneManager) {
      window.sceneManager.resizeCanvas();
    }
    if (window.timeline) {
      window.timeline.pause();
    }
  });

  const times = [
    { t: 9.9, name: 'preview_trans1_cubeglitch.jpg' },
    { t: 21.9, name: 'preview_trans2_laserblade.jpg' },
    { t: 39.9, name: 'preview_trans3_irisvault.jpg' },
    { t: 49.9, name: 'preview_trans4_quantumflash.jpg' },
    { t: 50.5, name: 'preview_scene5_thanh_spotlight.jpg' },
    { t: 53.5, name: 'preview_scene5_hoaianh_spotlight.jpg' },
    { t: 56.5, name: 'preview_scene5_convergence.jpg' },
    { t: 58.5, name: 'preview_scene5_asds2501_team.jpg' }
  ];

  for (const item of times) {
    await page.evaluate((t) => {
      window.timeline.seek(t);
    }, item.t);

    await page.screenshot({
      path: path.join(__dirname, item.name),
      type: 'jpeg',
      quality: 90,
      clip: { x: 0, y: 0, width: 1920, height: 1080 }
    });
    console.log(`Saved ${item.name} at ${item.t}s`);
  }

  await browser.close();
  server.close();
  console.log('All preview snapshots generated!');
}

capture().catch(console.error);
