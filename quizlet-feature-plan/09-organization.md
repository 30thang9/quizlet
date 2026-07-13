# 09 - Tổ Chức Nội Dung (Organization)

## 📋 Tổng Quan

```
┌─────────────────────────────────────────────────────────────────┐
│                    ORGANIZATION FEATURES                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📁 Folders                - Tổ chức theo thư mục                │
│  🏷️ Tags                   - Đánh dấu & phân loại              │
│  📚 Library                - Thư viện cá nhân                   │
│  🔍 Search & Filter       - Tìm kiếm & lọc                    │
│  ⭐ Favorites              - Đánh dấu yêu thích                │
│  📋 Lists                  - Tạo danh sách tùy ý               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 1. Folders

### 1.1 Folder Structure
```yaml
Folder:
  id: string
  name: string
  parent_id: string | null (for nested folders)
  color: string (hex color)
  icon: string (emoji or icon)
  
  settings:
    - is_shared: boolean
    - shared_with: User[]
    
  stats:
    - set_count: integer
    - total_cards: integer
```

### 1.2 Folder Hierarchy
```
┌─────────────────────────────────────────────────────────────────┐
│                    FOLDER STRUCTURE                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📚 My Library                                                  │
│  │                                                               │
│  ├── 📁 Biology                                                │
│  │   ├── 📁 Cells                                              │
│  │   │   ├── Chapter 1 Vocab                                   │
│  │   │   └── Chapter 2 Vocab                                  │
│  │   └── 📁 Genetics                                          │
│  │       ├── DNA & RNA                                        │
│  │       └── Mendelian Genetics                               │
│  │                                                             │
│  ├── 📁 Spanish                                               │
│  │   ├── Verbs                                                │
│  │   └── Vocabulary                                           │
│  │                                                             │
│  └── 📁 SAT Prep                                              │
│      ├── Reading                                               │
│      └── Writing                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 Folder Features
| Feature | Description |
|---------|-------------|
| Create folder | Tạo thư mục mới |
| Nested folders | Thư mục con |
| Rename folder | Đổi tên |
| Delete folder | Xóa (giữ/chuyển sets) |
| Move sets | Di chuyển sets vào folder |
| Color coding | Màu sắc folder |
| Icon selection | Icon cho folder |
| Share folder | Chia sẻ folder |

---

## 🏷️ 2. Tags

### 2.1 Tag System
```yaml
Tag:
  id: string
  name: string
  color: string
  category: string (optional)
  
  usage:
    - set_id: string
```

### 2.2 Tag Examples
```
┌─────────────────────────────────────────────────────────────────┐
│                    TAG EXAMPLES                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📚 By Subject                                                  │
│  ├── #biology                                                   │
│  ├── #math                                                      │
│  ├── #history                                                   │
│  └── #languages                                                 │
│                                                                 │
│  📅 By Time                                                     │
│  ├── #week-1                                                   │
│  ├── #midterm                                                   │
│  └── #finals                                                    │
│                                                                 │
│  🎯 By Purpose                                                  │
│  ├── #vocabulary                                               │
│  ├── #definitions                                               │
│  └── #formulas                                                  │
│                                                                 │
│  ⭐ By Priority                                                  │
│  ├── #high-priority                                            │
│  ├── #review-later                                             │
│  └── #mastered                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.3 Tag Features
| Feature | Description |
|---------|-------------|
| Add tags to sets | Thêm tag |
| Create new tags | Tạo tag mới |
| Tag colors | Màu sắc tag |
| Tag suggestions | Gợi ý tag |
| Filter by tags | Lọc theo tag |
| Bulk tag | Thêm tag nhiều sets |
| Tag categories | Nhóm tag |
| Popular tags | Tag phổ biến |

---

## 📚 3. Library

### 3.1 Library Views
```
┌─────────────────────────────────────────────────────────────────┐
│                    LIBRARY VIEWS                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📋 List View                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Set Name                Cards  Created    Updated       │   │
│  │ ─────────────────────────────────────────────────────   │   │
│  │ Biology Chapter 1        45    Jan 10    Jan 12        │   │
│  │ Spanish Verbs           120    Jan 8     Jan 15        │   │
│  │ SAT Math Formulas       30    Jan 5     Jan 14        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  🃏 Card View                                                    │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │  Set 1  │ │  Set 2  │ │  Set 3  │ │  Set 4  │              │
│  │  45 📖  │ │ 120 📖  │ │  30 📖  │ │  89 📖  │              │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Library Sections
| Section | Description |
|---------|-------------|
| All Sets | Tất cả sets |
| Created | Sets đã tạo |
| Liked | Sets đã thích |
| Copied | Sets đã copy |
| Folder view | Theo thư mục |
| Recent | Mới truy cập |
| Starred | Đã đánh dấu |

### 3.3 Library Features
- [ ] Grid/List view toggle
- [ ] Sort options (date, name, cards)
- [ ] Filter options
- [ ] Bulk actions
- [ ] Storage usage display
- [ ] Quick actions menu

---

## 🔍 4. Search & Filter

### 4.1 Search Features
```yaml
SearchCapabilities:
  # Search Scope
  - my_library: boolean
  - public_sets: boolean
  - classmates_sets: boolean
  
  # Search Types
  - keyword_search: boolean
  - advanced_search: boolean
  - filters: string[]
  
  # Search Results
  - preview_snippets: boolean
  - highlight_matches: boolean
  - related_results: boolean
```

### 4.2 Search Interface
```
┌─────────────────────────────────────────────────────────────────┐
│                    SEARCH INTERFACE                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  🔍 Search sets, terms, or creators...                   │   │
│  │                                                         │   │
│  │  [All ▼] [Any time ▼] [Sort: Relevance ▼]               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Filters:                                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ☑ Textbooks         ☐ With images                     │   │
│  │  ☑ Flashcards        ☐ With audio                     │   │
│  │  ☐ Diagrams          ☐ Verified creators              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Results: 234 sets found                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 Search Filters
| Filter | Options |
|--------|---------|
| Type | Flashcards, Diagrams, Learn |
| Language | Any language |
| Subject | Biology, Math, etc. |
| Card count | 1-10, 10-50, 50-100, 100+ |
| Created by | Me, Others |
| Date | Today, This week, This month, Any time |
| Visibility | Public, Private, Shared |
| Has | Images, Audio, Diagrams |

---

## ⭐ 5. Favorites & Stars

### 5.1 Star/Favorite Features
```
┌─────────────────────────────────────────────────────────────────┐
│                    FAVORITE FEATURES                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ⭐ Star a set                                                  │
│  └── Quick access from favorites section                       │
│                                                                 │
│  🌟 Starred sets section                                        │
│  └── Dedicated area for starred content                        │
│                                                                 │
│  📌 Pin to top                                                  │
│  └── Keep important sets at the top                           │
│                                                                 │
│  💗 Like a set                                                  │
│  └── Social interaction, appears on profile                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Quick Access Features
- [ ] Star/favorite button
- [ ] Starred section in library
- [ ] Pin to top
- [ ] Recent sets
- [ ] Quick study shortcut

---

## 📋 6. Custom Lists

### 6.1 List Features
```yaml
CustomList:
  id: string
  name: string
  description: string
  
  items:
    - type: "set" | "folder"
      id: string
      
  settings:
    - is_public: boolean
    - order_manually: boolean
```

### 6.2 List Use Cases
```
┌─────────────────────────────────────────────────────────────────┐
│                    LIST USE CASES                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📚 Course Organization                                         │
│  ├── "Biology 101 All Sets"                                    │
│  └── "Midterm Review Collection"                               │
│                                                                 │
│  🎯 Study Goals                                                 │
│  ├── "Must Master Before Exam"                                 │
│  └── "Weekly Practice"                                         │
│                                                                 │
│  👥 Group Projects                                              │
│  ├── "Team Study Materials"                                    │
│  └── "Project Resources"                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 7. Bulk Organization

### 7.1 Bulk Actions
```yaml
BulkActions:
  - move_to_folder: boolean
  - add_tags: boolean
  - remove_tags: boolean
  - change_visibility: boolean
  - delete: boolean
  - duplicate: boolean
  - export: boolean
```

### 7.2 Bulk Selection Interface
```
┌─────────────────────────────────────────────────────────────────┐
│                    BULK ACTIONS                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Selected: 5 sets                                              │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [Move to Folder ▼]  [Add Tags ▼]  [Delete]  [Cancel]  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ☑ Set 1                                                │   │
│  │  ☑ Set 2                                                │   │
│  │  ☑ Set 3                                                │   │
│  │  ☐ Set 4 (not selected)                                │   │
│  │  ☐ Set 5 (not selected)                                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 8. Organization Analytics

### 8.1 Library Stats
```yaml
LibraryStats:
  total_sets: integer
  total_cards: integer
  total_folders: integer
  total_tags: integer
  
  storage:
    used: bytes
    limit: bytes
    
  activity:
    sets_created_this_month: integer
    cards_added_this_month: integer
```

### 8.2 Storage Management
| Feature | Description |
|---------|-------------|
| Storage usage | Xem dung lượng đã dùng |
| Storage limit | Giới hạn (free: 100MB, Plus: 500MB) |
| Clear cache | Xóa cache |
| Delete unused | Xóa sets ít dùng |

---

## 🔧 9. Organization Settings

### 9.1 User Preferences
```yaml
OrganizationSettings:
  default_view: "grid" | "list"
  default_sort: "name" | "date" | "cards"
  sort_direction: "asc" | "desc"
  
  display:
    show_card_count: boolean
    show_created_date: boolean
    show_updated_date: boolean
    
  shortcuts:
    enable_keyboard: boolean
```

---

## 📱 Tiếp Theo

Xem **Gói Subscription & Pricing** trong file `10-subscriptions.md`
