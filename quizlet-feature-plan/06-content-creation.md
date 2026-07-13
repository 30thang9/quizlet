# 06 - Tạo & Quản Lý Nội Dung (Content Creation)

## 📋 Tổng Quan

```
┌─────────────────────────────────────────────────────────────────┐
│                    CONTENT CREATION                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📝 Manual Creation        - Tạo thủ công từng thẻ              │
│  📁 Import Files          - Import từ CSV, PDF, DOC             │
│  🖼️ Media Upload          - Hình ảnh, âm thanh                  │
│  📐 Diagrams              - Tạo sơ đồ có nhãn                   │
│  🔗 Import from URL       - Lấy nội dung từ web                 │
│  ✨ AI Generation         - Tạo tự động bằng AI                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📝 1. Manual Flashcard Creation

### 1.1 Card Editor Interface
```
┌─────────────────────────────────────────────────────────────────┐
│                    CREATE FLASHCARDS                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Term                          Definition                │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  ┌─────────────────────┐    ┌─────────────────────────┐ │   │
│  │  │ mitochondria        │    │ the powerhouse of the   │ │   │
│  │  │              🔊 📷  │    │ cell, produces ATP...   │ │   │
│  │  └─────────────────────┘    └─────────────────────────┘ │   │
│  │                                                         │   │
│  │  ┌─────────────────────┐    ┌─────────────────────────┐ │   │
│  │  │ photosynthesis       │    │ the process by which   │ │   │
│  │  │              🔊 📷  │    │ plants convert...      │ │   │
│  │  └─────────────────────┘    └─────────────────────────┘ │   │
│  │                                                         │   │
│  │  [+ Add Card]  [+ Add Multiple]  [Import]                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Set Title: [____________________________]                      │
│  Description: [____________________________]                    │
│  Language: [English ▼] → [Biology ▼]                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Card Creation Features
| Feature | Description |
|---------|-------------|
| Add single card | Thêm 1 thẻ |
| Add multiple | Thêm nhiều thẻ cùng lúc |
| Edit inline | Chỉnh sửa trực tiếp |
| Delete | Xóa thẻ |
| Duplicate | Nhân đôi thẻ |
| Reorder | Kéo thả sắp xếp |
| Bulk select | Chọn nhiều thẻ |
| Undo/Redo | Hoàn tác/Làm lại |

---

## 📁 2. Import Feature

### 2.1 Supported File Formats
```
┌─────────────────────────────────────────────────────────────────┐
│                    IMPORT FORMATS                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📄 Text Files                                                  │
│  ├── CSV (Comma-separated)                                     │
│  ├── TSV (Tab-separated)                                       │
│  └── TXT (Plain text)                                          │
│                                                                 │
│  📊 Documents                                                   │
│  ├── PDF                                                        │
│  ├── DOC/DOCX                                                   │
│  └── RTF                                                       │
│                                                                 │
│  📋 Data Sources                                                │
│  ├── From URL (web scraping)                                   │
│  ├── From Google Docs                                          │
│  └── From Excel (.xlsx)                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Import Wizard
```
┌─────────────────────────────────────────────────────────────────┐
│                    IMPORT WIZARD                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Step 1: Select Source                                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [Upload File]  [Paste Text]  [From URL]                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              [Next →]                            │
│                                                                 │
│  Step 2: Configure Parsing                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Separator: [Auto-detect ▼]                              │   │
│  │  First row is header: [☑]                               │   │
│  │  Preview: 3 columns detected                           │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │ Term | Definition | Example                    │   │   │
│  │  │ ────────────────────────────────────────        │   │   │
│  │  │ cell | basic unit | all living...              │   │   │
│  │  │ DNA  | genetic info| encodes...                │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              [Next →]                            │
│                                                                 │
│  Step 3: Review & Import                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Cards to import: 150                                  │   │
│  │  [Import All]  [Select Cards]                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.3 Import Features
| Feature | Description |
|---------|-------------|
| Auto-detect separator | Tự nhận diện dấu phân cách |
| Column mapping | Map cột với Term/Definition |
| Preview before import | Xem trước dữ liệu |
| Select cards to import | Chọn thẻ muốn import |
| Duplicate handling | Xử lý trùng lặp |
| Error highlighting | Đánh dấu lỗi |
| Import history | Lịch sử import |

---

## 🖼️ 3. Media Upload

### 3.1 Image Features
```yaml
ImageUpload:
  supported_formats: ["JPG", "PNG", "GIF", "TIFF", "WEBP"]
  max_size: 3MB
  auto_resize: true
  
  features:
    - upload_per_card: boolean
    - drag_drop: boolean
    - paste_from_clipboard: boolean
    - search_stock_images: boolean
    - crop_resize: boolean
```

### 3.2 Image Library
```
┌─────────────────────────────────────────────────────────────────┐
│                    IMAGE LIBRARY                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  🔍 Search images...                                     │   │
│  │  [My Uploads]  [Stock Photos]  [URL]                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  My Uploads:                                                    │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                │
│  │ img1 │ │ img2 │ │ img3 │ │ img4 │ │ img5 │                │
│  │      │ │      │ │      │ │      │ │      │                │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘                │
│                                                                 │
│  [Upload New]  [Delete Selected]                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.3 Audio Features
```yaml
AudioUpload:
  supported_formats: ["MP3", "WAV", "OGG"]
  max_size: 10MB
  
  features:
    - record_microphone: boolean
    - upload_file: boolean
    - text_to_speech: boolean
    - trim_audio: boolean
```

### 3.4 Media Management
- [ ] Upload images/audio per card
- [ ] Bulk upload
- [ ] Image search (stock photos)
- [ ] Drag & drop
- [ ] Clipboard paste
- [ ] Image cropping/resizing
- [ ] Audio recording
- [ ] Text-to-speech pronunciation

---

## 📐 4. Diagram Sets

### 4.1 Diagram Creation
```
┌─────────────────────────────────────────────────────────────────┐
│                    CREATE DIAGRAM                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │         ┌───────────────────────┐                       │   │
│  │         │                       │                       │   │
│  │         │    [Upload Image]      │                       │   │
│  │         │                       │                       │   │
│  │         └───────────────────────┘                       │   │
│  │                                                         │   │
│  │  Click on image to add labels:                         │   │
│  │                                                         │   │
│  │    ● Label 1                                             │   │
│  │    ● Label 2                                             │   │
│  │    ● Label 3                                             │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Label Editor:                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Point 1: "Mitochondria"                               │   │
│  │  Definition: "Double-membraned organelle..."            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Diagram Properties
```yaml
DiagramSet:
  id: string
  image: image_url
  labels: Label[]
  
Label:
  id: string
  x_position: number (percentage)
  y_position: number (percentage)
  term: string
  definition: string
  hint: string (optional)
```

### 4.3 Diagram Study Modes
| Mode | Description |
|------|-------------|
| Learn | Study with adaptive questions |
| Write | Type labels on diagram |
| Match | Match labels to positions |
| Flashcards | View and flip |

---

## ✨ 5. AI-Powered Creation

### 5.1 AI Generation Options
```
┌─────────────────────────────────────────────────────────────────┐
│                    AI CONTENT GENERATION                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 📝 Magic Notes                                              │
│     Upload class notes → Generate outlines, summaries,        │
│     practice materials, flashcards                            │
│                                                                 │
│  2. 🎴 AI Flashcard Generator                                  │
│     Input: Text, PDF, Image → Output: Flashcards               │
│                                                                 │
│  3. 📖 Auto-definition                                         │
│     Enter term → AI suggests definition                        │
│                                                                 │
│  4. 🖼️ AI Image Suggestions                                    │
│     Based on term → AI suggests relevant images                │
│                                                                 │
│  5. 🔗 Related Concepts                                        │
│     AI identifies and links related concepts                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Smart Generation Settings
```yaml
AIGenerationSettings:
  card_count: integer | "auto"
  difficulty: "basic" | "intermediate" | "advanced"
  include_examples: boolean
  include_definitions: boolean
  include_related: boolean
  language: string
  subject: string
```

---

## 📤 6. Export Feature

### 6.1 Export Formats
```
┌─────────────────────────────────────────────────────────────────┐
│                    EXPORT OPTIONS                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Format:                                                        │
│  ○ CSV (for spreadsheets)                                      │
│  ○ TSV (tab-separated)                                          │
│  ○ Plain text (.txt)                                           │
│  ○ JSON                                                        │
│  ○ Quizlet format (.quizlet)                                    │
│                                                                 │
│  Include:                                                      │
│  ☑ Terms                                                       │
│  ☑ Definitions                                                 │
│  ☐ Images (not available due to copyright)                    │
│  ☐ Audio                                                       │
│                                                                 │
│  Note: Only the set creator can export.                        │
│  Export is available on website only.                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Export Features
- [ ] CSV export
- [ ] TSV export
- [ ] TXT export
- [ ] JSON export
- [ ] Include/exclude fields
- [ ] Batch export
- [ ] Scheduled export (premium)

---

## 🗂️ 7. Content Organization

### 7.1 Set Metadata
```yaml
StudySetMetadata:
  title: string (required)
  description: string (optional)
  
  categorization:
    subject: string
    grade_level: string[]
    tags: string[]
    
  language_settings:
    term_language: string
    definition_language: string
    
  settings:
    visibility: "public" | "private" | "password" | "link"
    allow_comments: boolean
    allow_copies: boolean
```

### 7.2 Content Templates
| Template | Use Case |
|---------|----------|
| Basic flashcard | Vocabulary |
| Definition only | Definitions |
| Question & answer | Q&A format |
| Fill in blank | Cloze deletion |
| Image card | Visual learning |
| Audio card | Pronunciation |

---

## 📊 8. Content Quality

### 8.1 Quality Tools
```
┌─────────────────────────────────────────────────────────────────┐
│                    QUALITY CHECK TOOLS                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✓ Duplicate Detection                                          │
│    Find and merge duplicate cards                               │
│                                                                 │
│  ✓ Spelling Check                                               │
│    Highlight potential spelling errors                          │
│                                                                 │
│  ✓ Consistency Checker                                          │
│    Ensure consistent formatting                                 │
│                                                                 │
│  ✓ Empty Field Detection                                        │
│    Find cards with missing terms/definitions                    │
│                                                                 │
│  ✓ Card Count Warning                                           │
│    Alert if too few/many cards                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Quality Features
- [ ] Duplicate detection
- [ ] Spelling checker
- [ ] Auto-suggest corrections
- [ ] Empty field warnings
- [ ] Card balance analysis
- [ ] Content guidelines enforcement

---

## 🔧 9. Bulk Operations

### 9.1 Bulk Edit Features
| Feature | Description |
|---------|-------------|
| Select all/none | Chọn tất cả/ bỏ chọn |
| Multi-select | Chọn nhiều thẻ |
| Bulk delete | Xóa nhiều thẻ |
| Bulk move | Di chuyển sang set khác |
| Bulk tag | Thêm tag cho nhiều thẻ |
| Bulk language | Đổi ngôn ngữ |
| Bulk visibility | Đổi visibility |

---

## 💾 10. Auto-Save & Versioning

### 10.1 Save Features
- [ ] Auto-save every 30 seconds
- [ ] Manual save option
- [ ] Save notification
- [ ] Offline save queue
- [ ] Conflict detection
- [ ] Version history
- [ ] Restore previous versions
- [ ] Compare versions

---

## 📱 Tiếp Theo

Xem **Ứng Dụng Di Động & Offline** trong file `07-mobile-offline.md`
