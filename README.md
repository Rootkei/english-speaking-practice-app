# 🎯 English Speaking Practice App

Ứng dụng luyện nói tiếng Anh sử dụng Groq AI để tạo câu văn ngữ cảnh và phát âm tự động.

## ✨ Tính năng

- 🤖 **Tạo câu tự động bằng AI**: Sử dụng Groq AI để tạo 10 câu với ngữ cảnh khác nhau
- 🇻🇳 **Phụ đề tiếng Việt**: Hiển thị bản dịch tiếng Việt bên dưới mỗi câu tiếng Anh
- 🔊 **Phát âm tự động**: Text-to-speech để nghe phát âm chuẩn
- 🎲 **Từ ngẫu nhiên**: Tự động chọn từ ngẫu nhiên nếu không nhập gì
- 💾 **Lưu API key**: API key được lưu an toàn trong trình duyệt
- 🎨 **Giao diện đẹp mắt**: Thiết kế hiện đại với hiệu ứng glassmorphism và gradient

## 🚀 Cách sử dụng

### Bước 1: Lấy API Key từ Groq

1. Truy cập [Groq Console](https://console.groq.com/keys)
2. Đăng nhập bằng tài khoản Google hoặc GitHub
3. Click "Create API Key" và đặt tên cho key
4. Copy API key

### Bước 2: Cấu hình ứng dụng

1. Mở file `index.html` trong trình duyệt
2. Click vào nút "⚙️ API Settings"
3. Paste API key vào ô input
4. Click "💾 Save API Key"

### Bước 3: Bắt đầu luyện tập

1. **Nhập từ**: Gõ một từ tiếng Anh vào ô input
2. **Hoặc random**: Click "🎲 Random Word" để chọn từ ngẫu nhiên
3. **Tạo câu**: Click "✨ Generate Sentences"
4. **Nghe phát âm**: Click icon 🔊 để nghe từng câu

## 📁 Cấu trúc file

```
.
├── index.html      # File HTML chính
├── style.css       # CSS với design system
├── script.js       # JavaScript logic và Gemini API
└── README.md       # Hướng dẫn sử dụng
```

## 🔒 Bảo mật

- API key được lưu trong `localStorage` của trình duyệt
- Không gửi API key đến bất kỳ server nào khác ngoài Groq
- Tất cả xử lý đều diễn ra trên client-side

## 🛠️ Công nghệ sử dụng

- **HTML5**: Cấu trúc semantic
- **CSS3**: Design system với CSS variables, glassmorphism, animations
- **JavaScript (ES6+)**: Async/await, Fetch API, Web Speech API
- **Groq API**: Tạo câu văn tự động với LLaMA 3.3 70B
- **Web Speech API**: Text-to-speech

## 💡 Lưu ý

- Cần kết nối internet để sử dụng Groq API
- Trình duyệt cần hỗ trợ Web Speech API (Chrome, Edge, Safari)
- API key miễn phí có giới hạn số lượng request

## 🎨 Tùy chỉnh

Bạn có thể tùy chỉnh trong file `script.js`:

```javascript
const CONFIG = {
    maxSentences: 10,  // Số câu tạo ra (mặc định: 10)
    randomWords: [...] // Danh sách từ random
};
```

## 📝 License

Free to use for personal and educational purposes.

---

**Powered by Groq AI** ⚡
