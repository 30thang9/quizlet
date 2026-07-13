# 02 - Chế Độ Học Tập (Study Modes)

## 📋 Tổng Quan 6 Chế Độ Học

```
┌─────────────────────────────────────────────────────────────────┐
│                    QUIZLET STUDY MODES                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   CARDS     │  │    LEARN    │  │    TEST     │            │
│  │  (Flashcard)│  │  (Adaptive) │  │  (Quiz)     │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   MATCH     │  │    WRITE    │  │    SPELL    │            │
│  │  (Game)     │  │   (Type)    │  │  (Listen)   │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎴 1. Cards Mode (Chế độ Flashcard)

### 1.1 Core Features
| Feature | Description |
|---------|-------------|
| Flip to reveal | Click/Tap để lật thẻ |
| Navigate | Next/Previous buttons |
| Shuffle | Xáo trộn thứ tự |
| Auto-play | Tự động chuyển thẻ |
| Audio play | Phát âm thanh |
| Progress bar | Thanh tiến trình |

### 1.2 Card View Options
```
┌─────────────────────────────────────────────────────────────────┐
│  VIEW OPTIONS                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Stack View]    - Hiển thị dạng chồng thẻ                     │
│  [List View]     - Danh sách term + definition                 │
│  [Image View]    - Hình ảnh làm chủ đạo                         │
│  [Spell View]    - Ẩn term, chỉ hiện definition                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 Navigation Features
- [ ] Keyboard shortcuts (←/→, Space to flip)
- [ ] Touch swipe gestures
- [ ] Jump to specific card number
- [ ] Random card selection
- [ ] Filter by starred cards

---

## 📚 2. Learn Mode (Chế độ Học Thông Minh)

### 2.1 Adaptive Learning Algorithm
```
┌─────────────────────────────────────────────────────────────────┐
│                 LEARN MODE FLOW                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  START → Assess knowledge → Personalized path                  │
│                              ↓                                  │
│         ┌─────────────────────────────────┐                    │
│         │                                 │                    │
│         ▼                                 ▼                    │
│    Multiple Choice              Written Answer                  │
│    (4 options)                  (Type term)                     │
│         │                                 │                    │
│         └─────────────┬───────────────────┘                    │
│                       ↓                                        │
│              Correct/Incorrect?                                │
│                       ↓                                        │
│         ┌─────────────────────────────────┐                    │
│         │  Correct → Next card            │                    │
│         │  Incorrect → Re-teach + Retry  │                    │
│         └─────────────────────────────────┘                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Learn Mode Question Types
| Type | Description | Adaptive Behavior |
|------|-------------|-------------------|
| Multiple Choice | Chọn 1 trong 4 đáp án | Easier if struggling |
| Written Answer | Gõ đáp án | Progressive hints |
| Flashcard | Xem và flip | Builds confidence |

### 2.3 Learn Mode Settings (Premium)
```yaml
LearnSettings:
  daily_new_card_limit: integer (default: 20)
  daily_review_limit: integer (default: 100)
  questions_per_day: integer (optional cap)
  
  # Question type preferences
  include_multiple_choice: boolean
  include_written: boolean
  include_flashcards: boolean
  
  # Difficulty
  difficulty: "easy" | "medium" | "hard"
  
  # Custom paths
  custom_study_path: boolean
```

### 2.4 Learn Mode Features
- [ ] Personalized study schedule
- [ ] Memory score tracking per card
- [ ] Spaced repetition integration
- [ ] Multiple question types
- [ ] Progressive difficulty increase
- [ ] Progress save/resume
- [ ] Study streaks tracking
- [ ] Completion certificates

---

## 📝 3. Test Mode (Chế độ Kiểm tra)

### 3.1 Test Question Types
```
┌─────────────────────────────────────────────────────────────────┐
│                    TEST QUESTION TYPES                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Multiple Choice       - Chọn đáp án đúng                   │
│  2. True/False            - Đúng/Sai                            │
│  3. Fill in the Blank     - Điền từ còn thiếu                  │
│  4. Written Answer        - Tự gõ đáp án                       │
│  5. Matching              - Nối cột A với cột B                  │
│  6. Ordering              - Sắp xếp thứ tự                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Test Configuration
```yaml
TestConfig:
  question_count: integer (5-100)
  question_types: string[]
  time_limit: integer | null (minutes)
  passing_score: percentage (default: 70%)
  
  # Question selection
  include_only_starred: boolean
  randomize_order: boolean
  
  # Feedback
  show_correct_answers: boolean
  show_explanations: boolean
  show_score_immediately: boolean
```

### 3.3 Test Results & Analytics
```
┌─────────────────────────────────────────────────────────────────┐
│                 TEST RESULTS                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Score: 85% (17/20 correct)                                    │
│                                                                 │
│  Breakdown:                                                     │
│  ├── Multiple Choice: 8/10 ✓                                   │
│  ├── True/False: 4/5 ✓                                         │
│  └── Written: 5/5 ✓                                            │
│                                                                 │
│  Most Missed:                                                   │
│  1. "Photosynthesis" - 3 times wrong                           │
│  2. "Mitochondria" - 2 times wrong                              │
│                                                                 │
│  [Review Mistakes]  [Retry Test]  [Back to Set]                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.4 Test Mode Features
- [ ] Multiple question types
- [ ] Timed tests
- [ ] Randomized questions
- [ ] Immediate feedback option
- [ ] Detailed results breakdown
- [ ] Review mistakes immediately
- [ ] Retry test option
- [ ] Print test option

---

## 🔗 4. Match Mode (Trò chơi Ghép thẻ)

### 4.1 Game Mechanics
| Feature | Description |
|---------|-------------|
| Time attack | Đếm ngược thời gian |
| Combo system | Chuỗi đúng liên tiếp |
| Score tracking | Điểm số cao |
| Lives system | Số lần sai giới hạn |

### 4.2 Match Mode Flow
```
┌─────────────────────────────────────────────────────────────────┐
│                 MATCH GAMEPLAY                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────┐                   │
│  │           TERMS          DEFINITIONS     │                   │
│  │  ┌────────┐    ?      ┌────────────┐    │                   │
│  │  │ apple  │──────────│ quả táo    │    │                   │
│  │  └────────┘          └────────────┘    │                   │
│  │  ┌────────┐          ┌────────────┐    │                   │
│  │  │ banana │   ?      │ trái cây   │    │                   │
│  │  └────────┘          └────────────┘    │                   │
│  └──────────────────────────────────────────┘                   │
│                                                                 │
│  ⏱️ Time: 1:23        ⭐ Score: 150        ❤️ 2 left            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 Match Mode Features
- [ ] Timed matching game
- [ ] Drag and drop interface
- [ ] Click to select matching
- [ ] High score tracking
- [ ] Personal best records
- [ ] Leaderboard
- [ ] Different difficulty levels
- [ ] Offline available (mobile)

---

## ✍️ 5. Write Mode (Chế độ Viết)

### 5.1 Mechanics
```
┌─────────────────────────────────────────────────────────────────┐
│                 WRITE MODE                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Question: What is the capital of France?                       │
│                                                                 │
│  ┌─────────────────────────────────────────────────┐            │
│  │ Your answer: Paris                          ✓   │            │
│  └─────────────────────────────────────────────────┘            │
│                                                                 │
│  [Check] [Skip] [Show Answer]                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Write Mode Features
- [ ] Type-to-answer interface
- [ ] Case-insensitive matching
- [ ] Accent/diacritic tolerance
- [ ] Accept alternative spellings
- [ ] Hints system
- [ ] Progress tracking
- [ ] Spell check integration

---

## 🔊 6. Spell Mode (Chế độ Nghe)

### 6.1 Audio-Based Learning
```
┌─────────────────────────────────────────────────────────────────┐
│                 SPELL MODE                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🔊 [PLAY AUDIO]                                                │
│                                                                 │
│  ┌─────────────────────────────────────────────────┐            │
│  │ Type what you hear: ___________________          │            │
│  └─────────────────────────────────────────────────┘            │
│                                                                 │
│  Difficulty: ●○○○○ (Easy to Hard)                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Spell Mode Features
- [ ] Audio pronunciation playback
- [ ] Type what you hear
- [ ] Multiple playback option
- [ ] Slow audio option
- [ ] Phonetic hints
- [ ] Difficulty levels
- [ ] Progress tracking

---

## 📊 Comparison Matrix

| Feature | Cards | Learn | Test | Match | Write | Spell |
|---------|-------|-------|------|-------|-------|-------|
| Flashcard review | ✓ | ✓ | | | | |
| Multiple choice | | ✓ | ✓ | | | |
| Written answer | | ✓ | ✓ | | ✓ | |
| Timed | | | ✓ | ✓ | | |
| Game element | | | | ✓ | | |
| Audio | ✓ | | | | | ✓ |
| Adaptive | | ✓ | | | | |
| Score tracking | | ✓ | ✓ | ✓ | ✓ | ✓ |
| Free tier | ✓ | Limited | Limited | ✓ | Limited | Limited |

---

## 🚀 Premium Features by Mode

### Learn Mode Premium
- Unlimited rounds
- Custom study paths
- Smart grading
- Progress analytics

### Test Mode Premium
- Unlimited tests
- All question types
- Detailed analytics
- Export results

---

## 📱 Tiếp Theo

Xem **Tính năng AI** trong file `03-ai-features.md`
