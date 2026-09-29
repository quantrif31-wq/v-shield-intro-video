// ==========================================================================
// V-SHIELD VIDEO RECORDER & EXPORTER
// Records live canvas & audio stream using MediaRecorder API and downloads video
// ==========================================================================

class VideoRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.isRecording = false;
    this.exportBtn = document.getElementById('btn-export');
    this.bindEvents();
  }

  bindEvents() {
    if (this.exportBtn) {
      this.exportBtn.addEventListener('click', () => this.toggleRecord());
    }
  }

  async toggleRecord() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      await this.startRecording();
    }
  }

  async startRecording() {
    try {
      const stageEl = document.querySelector('.video-stage-container');
      const canvasEl = document.getElementById('renderCanvas');

      if (!window.MediaRecorder) {
        alert("Trình duyệt của bạn chưa hỗ trợ MediaRecorder API. Vui lòng sử dụng Chrome, Edge hoặc Firefox bản mới nhất.");
        return;
      }

      // Check if getDisplayMedia or canvas.captureStream is available
      let stream = null;
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        // High quality tab capture
        const confirmed = confirm("Chuẩn bị xuất Video V-Shield 60s:\n\n1. Trình duyệt sẽ hỏi chọn màn hình/thẻ để ghi.\n2. Hãy chọn 'Thẻ hiện tại' (Current Tab) và tích 'Chia sẻ âm thanh' (Share audio) để có cả nhạc & giọng đọc.\n3. Video sẽ tự động phát từ 0s -> 60s và tự động tải file về máy khi xong.\n\nBấm OK để bắt đầu!");
        if (!confirmed) return;

        stream = await navigator.mediaDevices.getDisplayMedia({
          video: { frameRate: 60, width: 1920, height: 1080 },
          audio: true
        });
      } else if (canvasEl && canvasEl.captureStream) {
        stream = canvasEl.captureStream(60);
      }

      if (!stream) {
        alert("Không thể khởi tạo luồng video để ghi hình.");
        return;
      }

      this.recordedChunks = [];
      const options = { mimeType: 'video/webm;codecs=vp9,opus' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'video/webm';
      }

      this.mediaRecorder = new MediaRecorder(stream, options);

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          this.recordedChunks.push(e.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        this.saveVideo();
        // Stop all tracks in stream
        stream.getTracks().forEach(track => track.stop());
      };

      this.mediaRecorder.start(100);
      this.isRecording = true;

      if (this.exportBtn) {
        this.exportBtn.innerHTML = '<span>🔴</span> ĐANG GHI HÌNH... (BẤM DỪNG)';
        this.exportBtn.style.background = '#ff0055';
        this.exportBtn.style.color = '#fff';
      }

      // Automatically reset timeline to 0 and play
      if (window.timeline) {
        window.timeline.seek(0);
        window.timeline.play();
      }

    } catch (err) {
      console.warn("User cancelled or capture failed:", err);
    }
  }

  stopRecording() {
    if (!this.isRecording || !this.mediaRecorder) return;
    this.mediaRecorder.stop();
    this.isRecording = false;

    if (this.exportBtn) {
      this.exportBtn.innerHTML = '<span>💾</span> XUẤT VIDEO (60s)';
      this.exportBtn.style.background = 'linear-gradient(135deg, var(--green), #00b060)';
      this.exportBtn.style.color = '#030712';
    }
  }

  saveVideo() {
    const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `V-Shield_Gioi_Thieu_60s_${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  }
}

window.videoRecorder = new VideoRecorder();
