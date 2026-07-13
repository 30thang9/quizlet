# 04 - Tính Năng Giáo Viên & Lớp Học (Classroom & Teacher)

## 📋 Tổng Quan

```
┌─────────────────────────────────────────────────────────────────┐
│                    TEACHER FEATURES                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  👨‍🏫 Teacher Accounts        - Tài khoản đặc biệt cho giáo viên  │
│  📚 Class Management       - Tạo & quản lý lớp học              │
│  📋 Assignments           - Giao bài tập cho học sinh          │
│  📊 Class Progress        - Theo dõi tiến độ học sinh          │
│  🎮 Quizlet Live          - Game học tập nhóm                  │
│  📈 Analytics Dashboard   - Báo cáo & thống kê                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 👨‍🏫 1. Teacher Accounts

### 1.1 Teacher Account Features
```yaml
TeacherAccount:
  profile:
    - name: string
    - school: string
    - subjects: string[]
    - grade_levels: string[]
    - avatar: image
    
  verified_status:
    - email_verification: boolean
    - school_email: boolean
    - institutional_badge: boolean
    
  special_features:
    - class_creation: boolean
    - assignment_tools: boolean
    - student_tracking: boolean
    - premium_for_teachers: boolean
```

### 1.2 Teacher Dashboard
```
┌─────────────────────────────────────────────────────────────────┐
│                 TEACHER DASHBOARD                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Welcome, [Teacher Name]                    [Settings]   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ My Classes   │  │ My Sets      │  │ Assignments  │          │
│  │ 5 active     │  │ 23 created   │  │ 12 pending   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Recent Class Activity                                  │   │
│  │  ├── Period 3 - 85% completed assignment               │   │
│  │  ├── Period 1 - Quizlet Live session today             │   │
│  │  └── Period 5 - New student joined                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [+ Create Class]  [+ Create Assignment]  [+ Create Set]        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📚 2. Class Management

### 2.1 Class Properties
```yaml
Class:
  id: string
  name: string
  subject: string
  period: string (e.g., "Period 1", "Morning")
  grade_level: string
  school: string
  
  settings:
    - enrollment_type: "code" | "invite" | "sync"
    - enrollment_code: string
    - require_login: boolean
    - show_student_names: boolean
    
  members:
    teachers: User[]
    students: User[]
    
  created_at: datetime
  updated_at: datetime
```

### 2.2 Class Setup Flow
```
┌─────────────────────────────────────────────────────────────────┐
│              CREATE CLASS FLOW                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Step 1: Basic Info                                            │
│  ┌─────────────────────────────────────────────────┐            │
│  │ Class Name: [________________]                   │            │
│  │ Subject: [___________________]                   │            │
│  │ Grade Level: [___________]                        │            │
│  └─────────────────────────────────────────────────┘            │
│                              [Next]                              │
│                                                                 │
│  Step 2: Enrollment Settings                                   │
│  ┌─────────────────────────────────────────────────┐            │
│  │ Enrollment Code: [ABC123]        [Generate New]  │            │
│  │ ☑ Allow students to join with code              │            │
│  │ ☑ Require school email                         │            │
│  └─────────────────────────────────────────────────┘            │
│                              [Next]                              │
│                                                                 │
│  Step 3: Review & Create                                        │
│                              [Create Class]                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.3 Class Management Features
| Feature | Description |
|---------|-------------|
| Create classes | Tạo lớp học mới |
| Edit class info | Chỉnh sửa thông tin lớp |
| Delete class | Xóa lớp học |
| Archive class | Lưu trữ lớp cũ |
| Duplicate class | Copy cấu trúc lớp |
| Merge classes | Gộp lớp |

### 2.4 Student Enrollment
```
┌─────────────────────────────────────────────────────────────────┐
│              STUDENT ENROLLMENT METHODS                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Enrollment Code        - Học sinh nhập mã lớp             │
│  2. Direct Invite         - Giáo viên gửi link mời            │
│  3. LMS Sync              - Đồng bộ từ Google Classroom        │
│  4. CSV Import            - Import danh sách email             │
│  5. Self-enrollment       - Học sinh tự đăng ký (cần duyệt)   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 3. Assignments

### 3.1 Assignment Types
```yaml
Assignment:
  id: string
  class_id: string
  study_set_id: string
  
  title: string
  description: string
  
  due_date: datetime
  due_time: time
  
  study_mode: "flashcards" | "learn" | "test" | "match" | "live"
  
  settings:
    - require_completion: boolean
    - min_score: percentage
    - attempts_allowed: integer
    - show_answers: boolean
    - shuffle_cards: boolean
    
  status: "not_started" | "active" | "completed" | "archived"
```

### 3.2 Assignment Creation
```
┌─────────────────────────────────────────────────────────────────┐
│              CREATE ASSIGNMENT                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Select Study Set:                                              │
│  ┌─────────────────────────────────────────────────┐            │
│  │ 🔍 Search your sets...                           │            │
│  │                                                 │            │
│  │ ○ Chapter 1 Vocabulary         (25 cards)       │            │
│  │ ○ Chapter 2 Vocabulary         (30 cards)  ✓     │            │
│  │ ○ Unit Test Review             (50 cards)       │            │
│  └─────────────────────────────────────────────────┘            │
│                                                                 │
│  Due Date: [Date Picker]    Due Time: [Time Picker]            │
│                                                                 │
│  Study Mode:                                                    │
│  [Learn ▼]    [Test]    [Flashcards]    [Match]                 │
│                                                                 │
│  Settings:                                                      │
│  ☑ Require completion to mark done                            │
│  ☐ Set minimum score                                          │
│                                                                 │
│                              [Assign to Class]                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.3 Assignment Modes
| Mode | Description | Use Case |
|------|-------------|----------|
| Learn | Adaptive learning | Daily practice |
| Flashcards | Card review | Review mode |
| Test | Quiz | Assessment |
| Match | Game | Engagement |
| Live | Real-time game | In-class activity |

### 3.4 Assignment Settings
- [ ] Due date/time
- [ ] Multiple attempts
- [ ] Minimum passing score
- [ ] Auto-assign to new students
- [ ] Notifications to students
- [ ] Reminder notifications
- [ ] Late submission allowance
- [ ] Partial credit

---

## 📊 4. Class Progress

### 4.1 Progress Dashboard
```
┌─────────────────────────────────────────────────────────────────┐
│              CLASS PROGRESS DASHBOARD                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Class: Period 3 - Biology 101                    [Export ▼]   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Assignment: Chapter 5 Review      Due: Yesterday      │   │
│  │                                                         │   │
│  │ Completion: 23/25 students (92%)                       │   │
│  │ Average Score: 78%                                      │   │
│  │                                                         │   │
│  │ Student List:                                          │   │
│  │ ┌─────────────────────────────────────────────────────┐ │   │
│  │ │ ✓ John D.     Completed    95%    15 min          │ │   │
│  │ │ ✓ Sarah M.    Completed    88%    20 min          │ │   │
│  │ │ ○ Mike T.     Not started  -       -                │ │   │
│  │ │ ✓ Emily R.    Completed    72%    25 min          │ │   │
│  │ └─────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [View All Assignments]  [Class Analytics]                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Progress Metrics
| Metric | Description |
|--------|-------------|
| Completion rate | % học sinh hoàn thành |
| Average score | Điểm trung bình |
| Time spent | Thời gian học trung bình |
| Most missed | Thẻ/ câu hay sai |
| Improvement | Tiến bộ so với lần trước |

### 4.3 Individual Student View
```
┌─────────────────────────────────────────────────────────────────┐
│              INDIVIDUAL STUDENT PROGRESS                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Student: John Doe                                             │
│                                                                 │
│  Overall Statistics:                                           │
│  ├── Total sets studied: 15                                    │
│  ├── Total time: 8.5 hours                                    │
│  ├── Average score: 84%                                        │
│  └── Streak: 12 days                                           │
│                                                                 │
│  Assignment History:                                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Set                    | Score | Time   | Date        │   │
│  │ Chapter 1 Vocab       | 92%   | 12 min | Jan 10       │   │
│  │ Chapter 2 Vocab       | 85%   | 15 min | Jan 12       │   │
│  │ Chapter 3 Vocab       | 88%   | 10 min | Jan 15       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [Message Student]  [View Detailed Report]                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.4 Class Progress Features
- [ ] Real-time progress tracking
- [ ] Per-assignment completion
- [ ] Individual student drill-down
- [ ] Most missed cards list
- [ ] Class-wide analytics
- [ ] Export to CSV/PDF
- [ ] Email notifications
- [ ] Reminder sending

---

## 🎮 5. Quizlet Live

### 5.1 Overview
Quizlet Live là game học tập collaborative cho phép học sinh thi đấu theo nhóm trong lớp.

### 5.2 Live Game Flow
```
┌─────────────────────────────────────────────────────────────────┐
│              QUIZLET LIVE WORKFLOW                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Teacher Setup:                                                 │
│  1. Select study set                                            │
│  2. Configure game settings                                     │
│  3. Generate game code                                          │
│  4. Share code with students                                    │
│                                                                 │
│  Student Join:                                                  │
│  → Go to quizlet.com/live                                      │
│  → Enter code: [ABC123]                                        │
│  → Enter name                                                   │
│                                                                 │
│  Game Start:                                                    │
│  1. Students auto-assigned to teams                             │
│  2. First question appears                                      │
│  3. Race to answer correctly                                    │
│  4. Team with most correct answers wins                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.3 Live Game Modes
| Mode | Description |
|------|-------------|
| Collaborative | Teams work together |
| Competitive | Individuals compete |
| Race | Fastest correct answer wins |

### 5.4 Live Features
- [ ] Real-time multiplayer
- [ ] Auto team balancing
- [ ] Leaderboard
- [ ] Live score updates
- [ ] Round-by-round results
- [ ] Post-game review
- [ ] Save game results
- [ ] Replay option

---

## 📈 6. Analytics & Reports

### 6.1 Teacher Analytics Dashboard
```
┌─────────────────────────────────────────────────────────────────┐
│              TEACHER ANALYTICS                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📊 Overview                                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │    Students      Sets         Time Studied            │   │
│  │      125          45           320 hours               │   │
│  │     ↑ 12%       ↑ 8%          ↑ 15%                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  📈 Trends Chart                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ^                                                        │   │
│  │  │    ╱╲                                                  │   │
│  │  │   ╱  ╲      ╱╲                                        │   │
│  │  │  ╱    ╲    ╱  ╲                                       │   │
│  │  └──────────────→                                        │   │
│  │    Week 1  2  3  4                                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  🎯 Top Performing Sets:                                        │
│  1. Chapter 5 Vocab - 89% avg                                   │
│  2. Chapter 3 Vocab - 85% avg                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Report Types
| Report | Description | Format |
|--------|-------------|--------|
| Class summary | Tổng quan lớp | PDF, CSV |
| Student progress | Tiến độ từng HS | PDF |
| Assignment results | Kết quả bài tập | PDF, CSV |
| Engagement report | Mức độ tham gia | PDF |
| Mastery report | Trình độ chuyên môn | PDF |

### 6.3 Export Options
- [ ] CSV download
- [ ] PDF report generation
- [ ] Google Sheets sync
- [ ] Gradebook export
- [ ] LMS integration sync

---

## 🔗 7. LMS Integration

### 7.1 Google Classroom Integration
```
┌─────────────────────────────────────────────────────────────────┐
│              GOOGLE CLASSROOM INTEGRATION                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Features:                                                     │
│  ├── Sync rosters from Google Classroom                        │
│  ├── Create assignments in GC                                   │
│  ├── Push grades back to GC                                    │
│  ├── Share Quizlet Live games                                  │
│  └── Access from GC add-on                                     │
│                                                                 │
│  Requirements:                                                 │
│  ├── Google Workspace for Education Plus                       │
│  └── Admin approval for add-on                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Other LMS Support
- [ ] Canvas LTI integration
- [ ] Blackboard integration
- [ ] Moodle integration
- [ ] Schoology integration

---

## 💰 Premium Teacher Features

### Quizlet Plus for Teachers
```
┌─────────────────────────────────────────────────────────────────┐
│              TEACHER PREMIUM FEATURES                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✓ Class Progress - Advanced tracking                          │
│  ✓ Student-by-student analytics                                │
│  ✓ Unlimited assignments                                       │
│  ✓ Custom class branding                                        │
│  ✓ Priority support                                             │
│  ✓ Study Guides generation                                     │
│  ✓ Expert Solutions access                                      │
│  ✓ AI-enhanced content creation                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📱 Tiếp Theo

Xem **Cộng tác & Nhóm học tập** trong file `05-collaboration.md`
