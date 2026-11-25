# Đạo Trường Cờ Vây — Học Cờ Vây Từ Nhập Môn Đến Cao Thủ

Ứng dụng web tương tác dạy Cờ Vây hoàn toàn bằng tiếng Việt, dẫn dắt người mới hoàn toàn (**30 Kyu**) đi qua **6 giai đoạn** lên đến trình độ thành thạo (**1 Dan+**).

## Tính năng chính

1. **Lộ Trình 6 Cấp Độ (30 Kyu → 1 Dan+):**
   - **Cấp 1 (Nhập môn — 9×9):** Khí, Bắt quân (Atari), Chạy trốn, Luật Tự sát & Luật Cướp (Ko).
   - **Cấp 2 (Chiến thuật — 9×9 → 13×13):** Nối & Cắt, Song Chiếu, Cầu Thang (Shicho), Thế Lưới (Geta), Hồi Mã Thương (Snapback), Đua Khí (Semeai).
   - **Cấp 3 (Sống & Chết — Tsumego):** Hai Mắt Sống, Mắt Thật vs Mắt Giả, Điểm Sống Chết, Phá Mắt Nakade, Song Sống (Seki).
   - **Cấp 4 (Hình Cờ & Thủ Cân — Tesuji):** Nối Tre vs Tam Giác Rỗng, Bẻ đầu hai quân, Điểm 1-1 phá mắt góc, Miệng Hổ.
   - **Cấp 5 (Khai Cuộc & Định Thức — 19×19):** Nguyên tắc Góc–Biên–Trung tâm, Định thức Tam Tam (3-3), Tiếp cận Mã (Kakari).
   - **Cấp 6 (Trung Cuộc & Thu Quan):** Đả Nhập vs Xâm Lấn (Đánh Vai), Tiên Thủ (Sente) & Hầu Khiêu (Monkey Jump).
2. **24 Bài Học & Thế Cờ Tương Tác:**
   - Chế độ **Minh họa từng bước** có chú thích chi tiết và tự chạy.
   - Chế độ **Giải thế cờ** tương tác trực tiếp trên bàn cờ: máy tự đỡ nước đúng hoặc phản đòn chỉ ra lỗi sai, kèm gợi ý và chế độ **Hiện Khí**.
   - Tự động lưu tiến độ học tập vào `localStorage`.
3. **Bàn Cờ Thực Hành & Đấu Với Máy:**
   - Hỗ trợ bàn `9×9`, `13×13`, `19×19` với đầy đủ luật bắt quân, Tự sát và Luật Cướp (Ko).
   - Chế độ **Đấu với Máy** hoặc **Tự bày cờ 2 bên**, có Undo, Pass, Hiện Khí và **Đếm điểm / Hiển thị vùng đất**.
4. **Từ Điển Thuật Ngữ Việt – Nhật – Anh:**
   - 36 thuật ngữ cốt lõi có tìm kiếm nhanh và liên kết thẳng đến bài học minh họa.

## Cách mở & sử dụng

- **Cách đơn giản nhất:** Mở trực tiếp file `index.html` bằng trình duyệt (Chrome, Edge, Firefox) — không cần cài đặt hay build.
- **Hoặc chạy qua máy chủ cục bộ (nếu muốn):**
  ```bash
  npx serve .
  ```
- **Chạy bộ kiểm thử tự động toàn bộ luật cờ & 24 thế cờ:**
  ```bash
  node tests/verify-puzzles.mjs
  ```
