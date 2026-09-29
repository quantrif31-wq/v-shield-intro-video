# V-SHIELD – Video Giới Thiệu Hệ Thống An Ninh Doanh Nghiệp (60 Giây)

Dự án dựng video đồ họa chuyển động (Motion Graphics) mô phỏng trực quan và sinh động hệ thống quản lý an ninh thông minh **V-Shield** theo kịch bản từ `kichban.txt` và ảnh thành viên nhóm.

---

## 📁 Cấu trúc Thư mục

```
video/
├── index.html         # Trang trình phát video đồ họa chuẩn 16:9 cinematic
├── chay_video.bat     # File kích hoạt nhanh mở video trên trình duyệt mặc định
├── css/
│   └── style.css      # Toàn bộ hoạt ảnh 60fps, hiệu ứng Cyberpunk/High-tech, Glassmorphism
├── js/
│   ├── audio.js       # Bộ tổng hợp âm thanh Web Audio (nhạc nền Synthwave, tiếng scan, chime, còi)
│   ├── speech.js      # Hệ thống thuyết minh tiếng Việt (TTS) và phụ đề karaoke đồng bộ
│   ├── scenes.js      # Bộ mô phỏng hoạt ảnh SVG/Canvas cho 5 phân cảnh
│   ├── timeline.js    # Quản lý dòng thời gian 60 giây, tua nhanh/chậm, jump cảnh
│   └── recorder.js    # Tính năng ghi màn hình / xuất video WebM/MP4 trực tiếp
├── PI00336.jpg        # Ảnh thành viên: Phạm Văn Thành (Raiden Shuga)
├── PI01945.jpg        # Ảnh thành viên: Phạm Ngọc Hoài Anh (Chúa tể Voucher)
└── kichban.txt        # Kịch bản thuyết minh và thông tin nhóm
```

---

## 🎬 5 Phân Cảnh Được Mô Phỏng (Đúng 60 Giây)

1. **Cảnh 1 (00:00 – 00:10): Giới thiệu & Bối cảnh Tổng thể**
   - Logo V-Shield khiên năng lượng và radar quét.
   - Bản đồ kiến trúc doanh nghiệp gồm 4 khu vực: Cổng chính, Bãi gửi xe, Đại sảnh tiếp tân và Khu vực nội bộ.
2. **Cảnh 2 (00:10 – 00:22): Hiện trạng Quản lý Truyền thống**
   - Bãi giữ xe thủ công: Bảo vệ ghi sổ tay, thẻ giấy dễ ướt rách/thất lạc, hàng xe ùn tắc.
   - Lỗ hổng kiểm soát: Kẻ giả mạo vượt qua sảnh lọt vào phòng Server cơ mật, kích hoạt cảnh báo an ninh.
3. **Cảnh 3 (00:22 – 00:40): Đột phá Công nghệ V-Shield**
   - Xe tiến vào cổng thông minh -> Camera AI quét Face ID & Biển số xe siêu tốc trong 0.2 giây.
   - Barrier nâng tự động mượt mà, lưu trữ dữ liệu thời gian thực lên Cloud.
   - Minh họa trực quan 3 giá trị cốt lõi: Nguyên tắc "Người vào = Người ra", Linh hoạt đổi xe an toàn, Bảo vệ theo dõi Dashboard thông minh.
4. **Cảnh 4 (00:40 – 00:50): Phân quyền Khu vực Nội bộ**
   - Cửa kính kiểm soát phân quyền hai chiều:
     + Nhân viên hợp lệ (Lê Thùy Dung - Level 3 R&D): Cửa mở xanh `ACCESS GRANTED`.
     + Kẻ gian / Sai quyền hạn: Đèn đỏ nhấp nháy, cửa khóa tức thì `ACCESS DENIED` kèm còi báo động.
5. **Cảnh 5 (00:50 – 01:00): Đội ngũ Sáng lập & Kết màn**
   - Thẻ hồ sơ Hologram công nghệ cao gắn ảnh thật của 2 thành viên:
     + **Phạm Văn Thành (Raiden Shuga)** – MSSV: PI00336: Trưởng nhóm, Backend, AI Engineer.
     + **Phạm Ngọc Hoài Anh (Chúa tể Voucher)** – MSSV: PI01945: Frontend, DevOps, Tester.
   - Slogan V-Shield và lời kêu gọi kết nối doanh nghiệp.

---

## 🚀 Cách Mở & Xem Video

1. **Cách 1 (Nhanh nhất)**: Nhấp đúp chuột vào file `chay_video.bat`.
2. **Cách 2**: Kéo thả hoặc mở trực tiếp file `index.html` bằng trình duyệt (Google Chrome, Microsoft Edge, Cốc Cốc, Firefox).
3. Bấm nút **▶ PHÁT VIDEO** trên màn hình để bắt đầu xem.

### Các Tính năng Tương tác:
- **Tua thời gian (Scrubber)**: Bấm hoặc kéo thanh trượt timeline từ 0 đến 60 giây.
- **Chuyển nhanh cảnh**: Bấm các nút `1. Giới thiệu`, `2. Hiện trạng`, `3. Đột phá AI`, `4. Phân quyền`, `5. Đội ngũ`.
- **Tùy chỉnh Âm thanh & Giọng đọc**:
  - `🔊 Âm thanh`: Bật/tắt nhạc nền công nghệ và hiệu ứng âm thanh SFX.
  - `🎙 Thuyết minh`: Bật/tắt giọng đọc tiếng Việt theo từng dòng phụ đề.
- **Tốc độ phát**: Chọn 0.75x, 1.0x, 1.25x hoặc 1.5x.
- **Xuất Video (60s)**: Bấm nút `💾 XUẤT VIDEO (60s)` để ghi lại toàn bộ hoạt ảnh và tự động tải file video về máy tính.
