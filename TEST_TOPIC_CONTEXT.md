# Hướng dẫn Test Topic Context Feature

## Các bước test:

### 1. Mở trang web
- Mở file: `file:///C:/Mine/test/index.html`
- Hoặc nếu đang dùng Live Server: `http://127.0.0.1:5500/index.html`

### 2. Hard Reload trang
- Nhấn `Ctrl + Shift + R` (hoặc `Ctrl + F5`) để clear cache và reload trang

### 3. Mở Settings
- Click vào nút **Settings** (⚙️) ở góc trên

### 4. Chọn Topic
- Tìm dropdown **"Select Topic"**
- Chọn một topic cụ thể, ví dụ: **"Business 💼"**

### 5. Generate sentences
- Click nút **"Random Word"** 
- Hoặc nhập một từ bất kỳ và click **"Generate Sentences"**

### 6. Kiểm tra Context
- Đợi 5-10 giây để API tạo câu
- Xem phần **Context** của mỗi câu (dòng màu xám bên dưới mỗi câu)
- **Kết quả mong đợi**: 
  - Nếu chọn "Business 💼" → Context phải liên quan đến Business (ví dụ: "Board Meeting", "Sales Negotiation", "Marketing Campaign", etc.)
  - Nếu chọn "Travel ✈️" → Context phải liên quan đến Travel (ví dụ: "Airport Check-in", "Hotel Booking", "Sightseeing Tour", etc.)
  - Nếu chọn "All Topics" → Context có thể random bất kỳ

### 7. Kiểm tra Server Log
- Mở terminal đang chạy server
- Xem log để confirm topic đã được gửi đúng
- Bạn sẽ thấy dòng log kiểu: `📝 Request: word="strategy", maxSentences=10, topic="Business 💼"`

### 8. Test nhiều topic khác nhau
- Thử chọn các topic khác: Technology 💻, Education 🎓, Health & Fitness 🏃‍♂️
- Mỗi lần đổi topic, generate lại và kiểm tra context

## Troubleshooting

### Nếu context vẫn không đúng topic:

1. **Kiểm tra server log** - Xem topic có được gửi đúng không
2. **Hard reload lại trang** - Đảm bảo code mới được load
3. **Kiểm tra console** - Mở Developer Tools (F12) → Console tab, xem có lỗi gì không
4. **Restart server** - Dừng server (Ctrl+C) và chạy lại: `.\venv\Scripts\Activate.ps1; python app.py`

### Debug trong Console:

Mở Console (F12) và chạy các lệnh sau:

```javascript
// Kiểm tra topic hiện tại
document.getElementById('topicSelect').value

// Kiểm tra tất cả topics có sẵn
Object.keys(TOPICS_DATA)

// Kiểm tra localStorage
localStorage.getItem('topic_preference')
```

## Lưu ý quan trọng:

- AI có thể không 100% tuân thủ instruction, nhưng **phần lớn contexts** phải liên quan đến topic đã chọn
- Nếu chọn topic nhưng nhập từ không liên quan, AI vẫn sẽ cố gắng tạo context theo topic
- Server phải đang chạy tại `http://127.0.0.1:5000`
