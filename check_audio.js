const ffmpeg = require('ffmpeg-static');
const { execSync } = require('child_process');
try {
  const res = execSync(`"${ffmpeg}" -i "V_Shield_Gioi_Thieu_60s.mp4"`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
  console.log(res);
} catch (e) {
  const out = e.stderr || e.stdout || e.message;
  console.log(out.split('\n').filter(l => l.includes('Duration') || l.includes('Audio')).join('\n'));
}
