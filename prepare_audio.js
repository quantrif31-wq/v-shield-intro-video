const ffmpeg = require('ffmpeg-static');
const { execSync } = require('child_process');
const fs = require('fs');

console.log('Processing user background music...');
const inputFile = 'SaveTik.io_7631200481888537876.mp3';
const outputFile = 'bgm_60s.mp3';

// Trim 60 seconds with fadeout at 58.5s
execSync(`"${ffmpeg}" -y -ss 0 -t 60 -i "${inputFile}" -af "afade=t=out:st=58.5:d=1.5" -c:a libmp3lame -b:a 192k "${outputFile}"`, { stdio: 'inherit' });

console.log('Created bgm_60s.mp3 successfully. File size:', (fs.statSync(outputFile).size / 1024 / 1024).toFixed(2), 'MB');
