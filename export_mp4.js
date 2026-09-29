// ==========================================================================
// V-SHIELD MP4 VIDEO EXPORTER (Full HD 1080p, 30 FPS, 60 Seconds)
// Uses Puppeteer-Core with MS Edge & FFmpeg image2pipe for pristine encoding
// ==========================================================================

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const puppeteer = require('puppeteer-core');
const ffmpegPath = require('ffmpeg-static');

// Parse CLI flags: node export_mp4.js [--frames 1800]
const args = process.argv.slice(2);
let totalFrames = 1800; // default 60s at 30 fps
const fps = 30;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--frames' && args[i + 1]) {
    totalFrames = parseInt(args[i + 1]);
  }
}

async function run() {
  console.log('====================================================');
  console.log(`🎬 BẮT ĐẦU XUẤT VIDEO V-SHIELD FULL HD 1080P (${totalFrames} frames, ${totalFrames / fps}s)`);
  console.log('====================================================');

  // 1. Start local HTTP server
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
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp3': 'audio/mpeg'
      };
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      fs.createReadStream(fullPath).pipe(res);
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  await new Promise(resolve => server.listen(0, resolve));
  const PORT = server.address().port;
  console.log(`[1/5] Máy chủ nội bộ đã sẵn sàng tại http://localhost:${PORT}`);

  // 2. Launch headless Edge
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
      '--window-size=1920,1080'
    ]
  });
  console.log('[2/5] Đã khởi chạy trình duyệt Edge Headless');

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle0' });

  // Activate 1080p export mode in page
  await page.evaluate(() => {
    document.body.classList.add('export-mode');
    if (window.sceneManager) {
      window.sceneManager.resizeCanvas();
    }
    if (window.timeline) {
      window.timeline.pause();
      window.timeline.seek(0);
    }
  });
  console.log('[3/5] Đã thiết lập khung hình Full HD 1920x1080 (Export Mode)');

  // 3. Spawn FFmpeg process
  const outputFile = path.join(__dirname, 'V_Shield_Gioi_Thieu_60s.mp4');
  const bgmFile = path.join(__dirname, 'bgm_60s.mp3');
  const audioFile = fs.existsSync(bgmFile) ? bgmFile : (fs.existsSync(path.join(__dirname, 'audio.wav')) ? path.join(__dirname, 'audio.wav') : null);

  console.log(`[Audio] Sử dụng tệp âm thanh: ${audioFile ? path.basename(audioFile) : 'None'}`);

  const ffmpegArgs = [
    '-y',
    '-f', 'image2pipe',
    '-vcodec', 'mjpeg',
    '-r', String(fps),
    '-i', '-',
    ...(audioFile ? ['-i', audioFile] : []),
    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-crf', '19',
    '-pix_fmt', 'yuv420p',
    ...(audioFile ? ['-c:a', 'aac', '-b:a', '192k', '-shortest'] : []),
    '-t', String(totalFrames / fps),
    outputFile
  ];

  const ffmpeg = spawn(ffmpegPath, ffmpegArgs);

  ffmpeg.stderr.on('data', (data) => {
    // Uncomment for debugging if needed:
    // console.log('FFmpeg:', data.toString());
  });

  const writeFrame = (buffer) => {
    return new Promise((resolve) => {
      if (!ffmpeg.stdin.write(buffer)) {
        ffmpeg.stdin.once('drain', resolve);
      } else {
        resolve();
      }
    });
  };

  console.log(`[4/5] Đang render và mã hóa từng khung hình sang file MP4...`);
  const startTime = Date.now();

  for (let frame = 0; frame < totalFrames; frame++) {
    const timeSec = frame / fps;

    // Seek timeline to exact timeSec
    await page.evaluate((t) => {
      window.timeline.seek(t);
    }, timeSec);

    // Capture JPEG screenshot at 1080p
    const screenshot = await page.screenshot({
      type: 'jpeg',
      quality: 95,
      clip: { x: 0, y: 0, width: 1920, height: 1080 }
    });

    await writeFrame(screenshot);

    if (frame % (fps * 2) === 0 || frame === totalFrames - 1) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const percent = ((frame / totalFrames) * 100).toFixed(1);
      const curSec = (frame / fps).toFixed(1);
      console.log(`   ⏳ Tiến độ: ${curSec}s / 60.0s (${percent}%) | Thời gian đã chạy: ${elapsed}s`);
    }
  }

  ffmpeg.stdin.end();

  await new Promise((resolve, reject) => {
    ffmpeg.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`FFmpeg exited with code ${code}`));
    });
  });

  await browser.close();
  server.close();

  const stats = fs.statSync(outputFile);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  const totalElapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('====================================================');
  console.log(`✅ XUẤT VIDEO THÀNH CÔNG!`);
  console.log(`📁 Đường dẫn: ${outputFile}`);
  console.log(`📊 Dung lượng: ${sizeMB} MB`);
  console.log(`⏱ Tổng thời gian kết xuất: ${totalElapsed} giây`);
  console.log('====================================================');
}

run().catch(err => {
  console.error('Lỗi khi xuất video:', err);
  process.exit(1);
});
