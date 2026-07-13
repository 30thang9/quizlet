# 05 - Cộng Tác & Nhóm Học Tập (Collaboration)

## 📋 Tổng Quan

```
┌─────────────────────────────────────────────────────────────────┐
│                    COLLABORATION FEATURES                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  👥 Study Groups         - Nhóm học tập cộng đồng               │
│  🔗 Sharing             - Chia sẻ bộ từ vựng                  │
│  👥 Co-editing          - Cùng chỉnh sửa study sets           │
│  💬 Comments            - Bình luận & phản hồi                │
│  🔄 Forking/Remix       - Copy & modify                        │
│  🏫 Class Collaboration  - Cộng tác trong lớp học             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 👥 1. Study Groups (Nhóm học tập)

### 1.1 Group Features
```yaml
StudyGroup:
  id: string
  name: string
  description: string
  subject: string
  privacy: "public" | "private"
  
  members:
    - user_id: string
      role: "admin" | "member"
      joined_at: datetime
      
  settings:
    - require_approval: boolean
    - allow_member_invite: boolean
    
  stats:
    - member_count: integer
    - sets_count: integer
    - total_study_time: duration
```

### 1.2 Study Group Dashboard
```
┌─────────────────────────────────────────────────────────────────┐
│                 STUDY GROUP DASHBOARD                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Group: Medical Terminology Study Circle        [Settings ⚙️] │
│  Members: 24 | Sets: 8 | Total Study Time: 45h                  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  📚 Shared Sets (8)                                     │   │
│  │  ├── Anatomy Chapter 1 (156 cards)                     │   │
│  │  ├── Anatomy Chapter 2 (142 cards)                     │   │
│  │  └── Pharmacology Basics (89 cards)                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  📊 Group Activity                                      │   │
│  │  ├── Sarah studied "Anatomy Ch 1" - 30 min ago         │   │
│  │  ├── Mike joined the group - 1 hour ago                │   │
│  │  └── New set "Pharmacology" added - 2 hours ago        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [Add Set]  [Start Study Session]  [Invite Members]           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 Group Features List
| Feature | Description |
|---------|-------------|
| Create group | Tạo nhóm mới |
| Invite members | Mời thành viên |
| Join request | Yêu cầu tham gia |
| Member roles | Admin/Member |
| Shared sets | Chia sẻ bộ từ trong nhóm |
| Group chat | Trò chuyện nhóm |
| Activity feed | Feed hoạt động |
| Group leaderboard | Bảng xếp hạng nhóm |

---

## 🔗 2. Sharing & Visibility

### 2.1 Visibility Options
```
┌─────────────────────────────────────────────────────────────────┐
│                    VISIBILITY LEVELS                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🌐 Public                                                      │
│  ├── Searchable by everyone                                     │
│  ├── Can be liked/commented                                     │
│  └── May appear in search results                               │
│                                                                 │
│  🔗 Link Only                                                   │
│  ├── Only accessible via direct link                            │
│  ├── Not searchable                                              │
│  └── No profile listing                                         │
│                                                                 │
│  🔐 Password Protected                                          │
│  ├── Requires password to view                                  │
│  └── Good for controlled sharing                                │
│                                                                 │
│  🔒 Private                                                     │
│  ├── Only owner can view                                        │
│  ├── Not searchable or shareable                                │
│  └── Full control                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Sharing Methods
| Method | Description |
|--------|-------------|
| Direct link | Copy URL to share |
| Social media | Share to FB, Twitter, etc. |
| Email | Send via email |
| Embed code | Embed on website/blog |
| QR code | Generate QR for quick access |

### 2.3 Share Dialog
```
┌─────────────────────────────────────────────────────────────────┐
│                    SHARE THIS SET                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Set: Advanced Vocabulary - GRE Prep                           │
│                                                                 │
│  Visibility: [Public ▼]                                        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  🔗 Copy Link                                            │   │
│  │  https://quizlet.com/abc123                              │   │
│  │  [Copy]                                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Share via:                                                    │
│  [Facebook] [Twitter] [Email] [LinkedIn]                       │
│                                                                 │
│  Embed:                                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ <iframe src="https://quizlet.com/embed/abc123"></iframe> │   │
│  │ [Copy Code]                                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✏️ 3. Co-editing & Permissions

### 3.1 Collaborative Editing
```yaml
CollaborationSettings:
  owner: user_id
  
  collaborators:
    - user_id: string
      permission: "view" | "edit" | "admin"
      
  permission_levels:
    view: "can view but not modify"
    edit: "can add/edit/delete cards"
    admin: "can manage settings & collaborators"
```

### 3.2 Real-time Collaboration Features
```
┌─────────────────────────────────────────────────────────────────┐
│              REAL-TIME COLLABORATION                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✏️ Multi-user editing                                          │
│  ├── See who's editing                                          │
│  ├── Conflict resolution                                       │
│  └── Version history                                            │
│                                                                 │
│  💬 Inline comments                                             │
│  ├── Comment on specific cards                                │
│  ├── Reply threads                                             │
│  └── Resolve comments                                          │
│                                                                 │
│  📝 Suggestion mode                                            │
│  ├── Propose changes                                           │
│  ├── Owner approves/rejects                                    │
│  └── Track suggestions                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.3 Version History
| Feature | Description |
|---------|-------------|
| Auto-save | Tự động lưu |
| Version list | Danh sách các phiên bản |
| Restore | Khôi phục phiên bản cũ |
| Compare | So sánh 2 phiên bản |
| Contributor list | Ai đã sửa gì |

---

## 💬 4. Comments & Feedback

### 4.1 Comment System
```
┌─────────────────────────────────────────────────────────────────┐
│                    COMMENTS SECTION                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  💬 12 Comments                                                 │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 👤 Sarah M. - 2 days ago                                 │   │
│  │ Great set! Could you add more examples?                  │   │
│  │                          [Reply]  [❤️ 3]                 │   │
│  │                                                           │   │
│  │   └─ 👤 Mike T. - 1 day ago                              │   │
│  │      Sure! I'll update it this weekend.                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Add a comment...                                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Comment Features
- [ ] Add comments to sets
- [ ] Reply to comments
- [ ] Edit own comments
- [ ] Delete own comments
- [ ] Flag inappropriate content
- [ ] Sort by newest/oldest
- [ ] Like/heart comments
- [ ] @mention users

---

## 🔄 5. Forking & Remixing

### 5.1 Copy/Remix Flow
```
┌─────────────────────────────────────────────────────────────────┐
│              COPY & REMIX FLOW                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Original Set: "Biology 101 Vocab" by @TeacherSmith            │
│  └── 150 cards | 1.2k likes | 5k copies                        │
│                                                                 │
│  User clicks "Copy/Remix"                                       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Copy "Biology 101 Vocab"                               │   │
│  │                                                         │   │
│  │  Name: [Biology 101 Vocab - My Version]                 │   │
│  │  Visibility: [Private ▼]                               │   │
│  │                                                         │   │
│  │  ☑ Include all 150 cards                               │   │
│  │  ☑ Keep original attributions                          │   │
│  │                                                         │   │
│  │                      [Copy Set]                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Remix Features
| Feature | Description |
|---------|-------------|
| Full copy | Copy toàn bộ set |
| Partial copy | Chọn cards để copy |
| Keep attributions | Giữ credit người tạo gốc |
| Edit independently | Chỉnh sửa riêng |
| Track original | Link đến set gốc |

---

## 👥 6. Follow System

### 6.1 Follow Features
```
┌─────────────────────────────────────────────────────────────────┐
│                    FOLLOW SYSTEM                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  👤 Profile Page                                                │
│  ├── Follow button                                             │
│  ├── Follower count                                            │
│  └── Following count                                           │
│                                                                 │
│  📊 Activity Feed                                               │
│  ├── New sets created                                          │
│  ├── Sets updated                                              │
│  └── Study achievements                                        │
│                                                                 │
│  🔔 Notifications                                              │
│  ├── New follower alert                                        │
│  ├── New public set alert                                      │
│  └── Milestone alerts                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 User Stats Display
| Stat | Description |
|------|-------------|
| Followers | Số người theo dõi |
| Following | Số người đang theo dõi |
| Public sets | Số set công khai |
| Total copies | Số lần được copy |
| Total likes | Tổng lượt thích |

---

## 🏫 7. Class Collaboration

### 7.1 Class Member Features
```yaml
ClassCollaboration:
  shared_sets: StudySet[]
  
  collaborative_sets:
    - set_id: string
      can_edit: User[]
      
  class_activities:
    - type: "study_session" | "assignment"
      initiated_by: User
      participants: User[]
```

### 7.2 Class Activity Features
- [ ] Shared class sets
- [ ] Collaborative set creation
- [ ] Group study sessions
- [ ] Class challenges
- [ ] Peer practice mode
- [ ] Study partner matching

---

## 🔐 8. Privacy Controls

### 8.1 User Privacy Settings
```
┌─────────────────────────────────────────────────────────────────┐
│                    PRIVACY SETTINGS                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Profile Visibility:                                            │
│  ○ Public - Everyone can see                                   │
│  ● Followers only - Only followers can see                     │
│  ○ Private - Hidden from search                                │
│                                                                 │
│  Activity Visibility:                                           │
│  ☑ Show study activity on profile                              │
│  ☑ Show created sets                                           │
│  ☐ Show comments on others' sets                               │
│                                                                 │
│  Communication:                                                 │
│  ☑ Allow comments on my sets                                   │
│  ☑ Allow messages from others                                  │
│  ☐ Show email publicly                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Content Moderation
| Feature | Description |
|---------|-------------|
| Report content | Báo cáo nội dung xấu |
| Block users | Chặn người dùng |
| Filter comments | Lọc bình luận |
| Age restrictions | Hạn chế theo độ tuổi |
| Content guidelines | Hướng dẫn nội dung |

---

## 📊 9. Collaboration Stats

### 9.1 Set Statistics Tracked
```yaml
SetStatistics:
  views: integer
  likes: integer
  copies: integer
  comments: integer
  
  engagement:
    avg_time_studied: duration
    completion_rate: percentage
    return_rate: percentage
    
  social:
    shares: integer
    embeds: integer
```

---

## 📱 Tiếp Theo

Xem **Tạo & Quản lý Nội dung** trong file `06-content-creation.md`
