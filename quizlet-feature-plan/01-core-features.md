# 01 - Tính Năng Cốt Lõi (Core Features)

## 📚 1. Flashcard System

### 1.1 Basic Flashcard Structure
| Field | Type | Description |
|-------|------|-------------|
| `term` | text | Từ/cụm từ chính (question) |
| `definition` | text | Định nghĩa/giải thích (answer) |
| `image` | media | Hình ảnh đi kèm (tùy chọn) |
| `audio` | media | File âm thanh phát âm (tùy chọn) |
| `diagrams` | media | Sơ đồ/đồ thị (tùy chọn) |

### 1.2 Flashcard Card Types
```
┌────────────────────────────────────────────────────────────────┐
│                    FLASHCARD CARD TYPES                        │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  1. Basic (2-sided)      - Term + Definition                   │
│  2. Image-only           - Chỉ hình ảnh (question/answer)     │
│  3. Audio-only           - Chỉ âm thanh                       │
│  4. Rich Media           - Kết hợp text + image + audio       │
│  5. Multiple Choice      - Nhiều đáp án                      │
│  6. Fill in Blank        - Điền vào chỗ trống                │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 1.3 Flashcard Interactions
- **Flip animation**: Lật thẻ để xem đáp án
- **Star/Favorite**: Đánh dấu thẻ quan trọng
- **Edit inline**: Chỉnh sửa trực tiếp trên thẻ
- **Delete**: Xóa thẻ
- **Reorder**: Sắp xếp lại thứ tự
- **Bulk select**: Chọn nhiều thẻ cùng lúc

---

## 📖 2. Study Sets (Bộ từ vựng)

### 2.1 Study Set Properties
```yaml
StudySet:
  id: string
  title: string
  description: string
  visibility: "public" | "private" | "password" | "link-only"
  password: string (optional)
  language: string (term language)
  translated_language: string (definition language)
  subject: string (category)
  tags: string[]
  created_by: user_id
  created_at: datetime
  updated_at: datetime
  card_count: integer
  views: integer
  likes: integer
  copies: integer
  is_featured: boolean
```

### 2.2 Study Set Creation Methods
```
┌─────────────────────────────────────────────────────────────────┐
│              CREATION METHODS                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Manual Entry          - Nhập tay từng thẻ                 │
│  2. Import from File      - CSV, TSV, TXT, DOC                 │
│  3. Import from URL       - Paste từ trang web                 │
│  4. AI Auto-generate      - Tạo tự động từ nội dung            │
│  5. Duplicate existing    - Copy từ set có sẵn                │
│  6. Quick create          - Tạo nhanh từ ghi chú             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.3 Study Set Visibility Settings
| Level | Description | Access |
|-------|-------------|--------|
| `public` | Công khai | Mọi người tìm kiếm và xem |
| `private` | Riêng tư | Chỉ chủ sở hữu |
| `password` | Bảo vệ mật khẩu | Cần mật khẩu |
| `link-only` | Chỉ qua link | Không tìm kiếm được |

---

## 🔄 3. Spaced Repetition System (SRS)

### 3.1 Algorithm Components
```
┌─────────────────────────────────────────────────────────────────┐
│                    SRS ALGORITHM                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Memory Score: 0-100%                                          │
│  ├── Based on: correct/incorrect responses                      │
│  ├── Time between reviews                                      │
│  └── Difficulty of card                                        │
│                                                                 │
│  Review Intervals:                                             │
│  ├── New cards: 1 day                                          │
│  ├── Learning: progressive intervals                            │
│  └── Mature: exponential growth (1, 3, 7, 14, 30, 60...)      │
│                                                                 │
│  Difficulty Ratings:                                           │
│  ├── Again (0) - Reset to learning                              │
│  ├── Hard (1) - Shorter interval                                │
│  ├── Good (2) - Normal interval                                 │
│  └── Easy (3) - Longer interval                                 │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### 3.2 SRS Features
- [ ] Automatic scheduling based on performance
- [ ] Configurable daily new card limit
- [ ] Configurable daily review limit
- [ ] Learning steps configuration
- [ ] Graduating interval settings
- [ ] Easy interval settings
- [ ] Card difficulty adjustment
- [ ] Leech detection (cards studied too many times)

---

## 📊 4. Progress & Statistics

### 4.1 Individual Progress Tracking
```yaml
UserProgress:
  - total_cards_learned: integer
  - total_study_time: duration
  - streak_days: integer
  - accuracy_rate: percentage
  - mastery_level: "new" | "learning" | "review" | "mastered"
  - cards_by_status:
      new: integer
      learning: integer
      young: integer
      mature: integer
```

### 4.2 Session Statistics
- Cards studied in session
- Time spent
- Accuracy percentage
- Cards mastered
- Review cards due
- New cards learned

### 4.3 Long-term Statistics
- Heat map calendar (days studied)
- Total hours studied
- Total cards created
- Average accuracy over time
- Progress graphs

---

## ⭐ 5. User Interactions

### 5.1 Social Features
```
┌─────────────────────────────────────────────────────────────────┐
│              SOCIAL FEATURES                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ★ Like/Favorite          - Thích study set                    │
│  ♻️ Share                  - Chia sẻ qua link, mạng xã hội      │
│  📋 Copy/Remix            - Copy để chỉnh sửa riêng           │
│  💬 Comments              - Bình luận trên set công khai       │
│  👥 Follow                - Theo dõi người tạo                │
│  📈 Followers/Following   - Danh sách theo dõi                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 User Profiles
- Avatar upload
- Bio/description
- Subject interests
- Study statistics public/private toggle
- Badges/achievements display
- Public profile URL
- Privacy settings

---

## 🏷️ 6. Content Types

### 6.1 Supported Media Types
| Type | Formats | Max Size | Notes |
|------|---------|----------|-------|
| Images | JPG, PNG, GIF, TIFF, WEBP | 3MB | Auto-resize on upload |
| Audio | MP3, WAV, OGG | 10MB | Pronunciation, listening |
| Diagrams | PNG, JPG with annotations | 3MB | Labeled regions |

### 6.2 Rich Content Features
- [ ] Image upload per card
- [ ] Audio upload per card
- [ ] Rich text formatting (bold, italic, underline)
- [ ] Math equations (LaTeX support)
- [ ] Code snippets with syntax highlighting
- [ ] Links in definitions

---

## 📱 Tiếp Theo

Xem chi tiết **Chế độ học tập** trong file `02-study-modes.md`
