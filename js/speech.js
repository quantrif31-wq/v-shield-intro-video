// ==========================================================================
// V-SHIELD SPEECH & SUBTITLE CONTROLLER
// Synchronizes Vietnamese subtitles & optional Web Speech narration
// ==========================================================================

const SUBTITLE_TRACKS = [
  {
    start: 0.0,
    end: 4.5,
    scene: 1,
    text: "V-Shield – <span class='highlight'>Giải pháp quản lý an ninh thông minh</span> cho doanh nghiệp hiện đại.",
    speech: "V-Shield. Giải pháp quản lý an ninh thông minh cho doanh nghiệp hiện đại."
  },
  {
    start: 4.5,
    end: 9.6,
    scene: 1,
    text: "Doanh nghiệp gồm nhiều khu vực: <span class='highlight'>Cổng chính, Bãi xe, Đại sảnh</span> và <span class='highlight'>Khu vực nội bộ riêng biệt</span>.",
    speech: "Doanh nghiệp gồm nhiều khu vực: Cổng chính, Bãi xe, Đại sảnh và Khu vực nội bộ riêng biệt."
  },
  {
    start: 9.6,
    end: 15.6,
    scene: 2,
    text: "Bãi giữ xe thủ công dùng <span class='highlight'>sổ ghi chép, thẻ giấy</span>: Dễ thất lạc, thông tin khó tra cứu, ùn tắc giờ cao điểm.",
    speech: "Bãi giữ xe thủ công dùng sổ ghi chép, thẻ giấy: Dễ thất lạc, thông tin khó tra cứu, ùn tắc giờ cao điểm."
  },
  {
    start: 15.6,
    end: 21.6,
    scene: 2,
    text: "Kiểm soát bằng mắt thường tạo <span class='highlight'>sơ hở cho kẻ gian trà trộn</span>, gây áp lực nặng nề lên nhân viên an ninh.",
    speech: "Kiểm soát bằng mắt thường tạo sơ hở cho kẻ gian trà trộn, gây áp lực nặng nề lên nhân viên an ninh."
  },
  {
    start: 21.6,
    end: 27.6,
    scene: 3,
    text: "V-Shield ứng dụng AI nhận diện <span class='highlight'>Biển số và Khuôn mặt</span> với tốc độ cực cao, chỉ mất 0.2 giây!",
    speech: "V-Shield ứng dụng AI nhận diện Biển số và Khuôn mặt với tốc độ cực cao, chỉ mất 0.2 giây!"
  },
  {
    start: 27.6,
    end: 33.6,
    scene: 3,
    text: "Tự động lưu trữ lịch sử, <span class='highlight'>truy vết tức thì</span>. Bảo vệ chuyển từ ghi chép sang theo dõi và xử lý bất thường.",
    speech: "Tự động lưu trữ lịch sử, truy vết tức thì. Bảo vệ chuyển từ ghi chép sang theo dõi và xử lý bất thường."
  },
  {
    start: 33.6,
    end: 39.6,
    scene: 3,
    text: "Nguyên tắc: <span class='highlight'>Người đưa xe vào chỉ có thể đưa xe ra</span> (hoặc ủy quyền). Không bắt buộc cố định xe, linh hoạt tuyệt đối!",
    speech: "Nguyên tắc: Người đưa xe vào chỉ có thể đưa xe ra, hoặc ủy quyền. Không bắt buộc cố định xe, linh hoạt tuyệt đối!"
  },
  {
    start: 39.6,
    end: 45.0,
    scene: 4,
    text: "Tại khu vực nội bộ: Kết hợp Face ID với <span class='highlight'>ma trận phân quyền chi tiết</span>. Nhân viên di chuyển thuận tiện theo đúng thẩm quyền.",
    speech: "Tại khu vực nội bộ: Kết hợp Face ID với ma trận phân quyền chi tiết. Nhân viên di chuyển thuận tiện theo đúng thẩm quyền."
  },
  {
    start: 45.0,
    end: 49.6,
    scene: 4,
    text: "Người lạ hoặc xâm nhập trái phép bị <span class='highlight'>từ chối ngay lập tức</span>, kích hoạt còi báo động và khóa cửa an toàn.",
    speech: "Người lạ hoặc xâm nhập trái phép bị từ chối ngay lập tức, kích hoạt còi báo động và khóa cửa an toàn."
  },
  {
    start: 49.6,
    end: 53.0,
    scene: 5,
    text: "Nhà sáng lập 01: <span class='highlight'>Phạm Văn Thành (Raiden Shuga)</span> – Trưởng nhóm ASDS2501, Backend Developer & Kỹ sư AI.",
    speech: "Nhà sáng lập 01: Phạm Văn Thành, Raiden Shuga – Trưởng nhóm ASDS2501, Backend Developer và Kỹ sư AI."
  },
  {
    start: 53.0,
    end: 56.0,
    scene: 5,
    text: "Nhà sáng lập 02: <span class='highlight'>Phạm Ngọc Hoài Anh (Chúa tể Voucher)</span> – Frontend Developer, DevOps & Automation Tester.",
    speech: "Nhà sáng lập 02: Phạm Ngọc Hoài Anh, Chúa tể Voucher – Frontend Developer, DevOps và Automation Tester."
  },
  {
    start: 56.0,
    end: 60.0,
    scene: 5,
    text: "Hội tụ đội ngũ <span class='highlight'>ASDS2501</span> – <span class='highlight'>V-Shield: An ninh vững chắc, Quản trị tương lai!</span> Hãy liên hệ với chúng tôi.",
    speech: "Hội tụ đội ngũ ASDS2501: V-Shield – An ninh vững chắc, Quản trị tương lai! Hãy liên hệ với chúng tôi."
  }
];

function getTypedHTML(htmlString, progress) {
  if (progress >= 1.0) return htmlString;
  if (progress <= 0.0) return `<span class="typewriter-cursor">|</span>`;

  // Tokenize into tags and text characters
  const tokens = [];
  let totalChars = 0;
  let i = 0;
  while (i < htmlString.length) {
    if (htmlString[i] === '<') {
      const closeIdx = htmlString.indexOf('>', i);
      if (closeIdx !== -1) {
        tokens.push({ type: 'tag', content: htmlString.substring(i, closeIdx + 1) });
        i = closeIdx + 1;
        continue;
      }
    }
    let nextTag = htmlString.indexOf('<', i);
    if (nextTag === -1) nextTag = htmlString.length;
    const textChunk = htmlString.substring(i, nextTag);
    tokens.push({ type: 'text', content: textChunk });
    totalChars += textChunk.length;
    i = nextTag;
  }

  // Typewriter timing: finish typing around 65% of track duration
  const typeSpeedFactor = 1.5;
  const targetChars = Math.min(totalChars, Math.floor(progress * totalChars * typeSpeedFactor));

  let output = '';
  let charsLeft = targetChars;
  const openTags = [];

  for (const token of tokens) {
    if (token.type === 'tag') {
      output += token.content;
      if (token.content.startsWith('</')) {
        openTags.pop();
      } else if (!token.content.endsWith('/>')) {
        const tagNameMatch = token.content.match(/<([a-zA-Z0-9]+)/);
        if (tagNameMatch) openTags.push(tagNameMatch[1]);
      }
    } else {
      if (charsLeft <= 0) break;
      const take = Math.min(charsLeft, token.content.length);
      output += token.content.substring(0, take);
      charsLeft -= take;
      if (charsLeft <= 0) break;
    }
  }

  // Close any tags still open
  for (let j = openTags.length - 1; j >= 0; j--) {
    output += `</${openTags[j]}>`;
  }

  if (targetChars < totalChars) {
    output += `<span class="typewriter-cursor">|</span>`;
  }

  return output;
}

class SpeechManager {
  constructor() {
    this.isVoiceEnabled = false;
    this.synth = window.speechSynthesis || null;
    this.vnVoice = null;
    this.lastSpokenIndex = -1;
    this.initVoices();
  }

  initVoices() {
    if (!this.synth) return;
    const loadVoices = () => {
      const voices = this.synth.getVoices();
      this.vnVoice = voices.find(v => v.lang.startsWith('vi') || v.lang === 'vi_VN') || null;
    };

    loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }
  }

  toggleVoice() {
    this.isVoiceEnabled = !this.isVoiceEnabled;
    if (!this.isVoiceEnabled && this.synth) {
      this.synth.cancel();
    }
    return this.isVoiceEnabled;
  }

  update(currentTime, subtitleElement) {
    let activeTrack = null;
    let activeIndex = -1;

    for (let i = 0; i < SUBTITLE_TRACKS.length; i++) {
      const track = SUBTITLE_TRACKS[i];
      if (currentTime >= track.start && currentTime < track.end) {
        activeTrack = track;
        activeIndex = i;
        break;
      }
    }

    if (activeTrack && subtitleElement) {
      const duration = activeTrack.end - activeTrack.start;
      const progress = Math.max(0, Math.min(1, (currentTime - activeTrack.start) / duration));
      subtitleElement.innerHTML = getTypedHTML(activeTrack.text, progress);
      subtitleElement.parentElement.style.opacity = '1';

      if (this.isVoiceEnabled && activeIndex !== this.lastSpokenIndex) {
        this.speak(activeTrack.speech);
        this.lastSpokenIndex = activeIndex;
      }
    } else if (subtitleElement) {
      subtitleElement.innerHTML = "...";
      subtitleElement.parentElement.style.opacity = '0.4';
    }

    if (activeIndex === -1) {
      this.lastSpokenIndex = -1;
    }
  }

  speak(text) {
    if (!this.synth || !this.isVoiceEnabled) return;
    this.synth.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    if (this.vnVoice) utter.voice = this.vnVoice;
    utter.lang = 'vi-VN';
    utter.rate = 1.05;
    utter.pitch = 1.0;
    this.synth.speak(utter);
  }

  reset() {
    if (this.synth) this.synth.cancel();
    this.lastSpokenIndex = -1;
  }
}

window.speechManager = new SpeechManager();
window.SUBTITLE_TRACKS = SUBTITLE_TRACKS;
