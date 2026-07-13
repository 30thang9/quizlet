# 07 - Ứng Dụng Di Động & Offline (Mobile & Offline)

## 📋 Tổng Quan

```
┌─────────────────────────────────────────────────────────────────┐
│                    MOBILE & OFFLINE                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📱 iOS App                - Ứng dụng iPhone/iPad              │
│  🤖 Android App            - Ứng dụng Android                  │
│  🌐 Progressive Web App    - PWA cho trình duyệt               │
│  📶 Offline Mode           - Học không cần mạng               │
│  🔄 Auto-sync              - Đồng bộ khi có mạng              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📱 1. iOS App

### 1.1 App Features
```yaml
iOSApp:
  min_version: iOS 15.0+
  
  features:
    # Core
    - flashcard_study: boolean
    - all_study_modes: boolean
    - create_edit_sets: boolean
    - offline_study: boolean
    
    # AI (Premium)
    - magic_notes: boolean
    - ai_flashcards: boolean
    - expert_solutions: boolean
    
    # Social
    - share_sets: boolean
    - follow_users: boolean
    - comments: boolean
    
  special_features:
    - voice_recognition: boolean
    - camera_ocr: boolean
    - haptics: boolean
    - widgets: boolean
```

### 1.2 iOS-Specific Features
```
┌─────────────────────────────────────────────────────────────────┐
│                    iOS SPECIAL FEATURES                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🍎 Apple Ecosystem                                             │
│  ├── Siri Shortcuts integration                                 │
│  ├── Widgets support                                            │
│  ├── Haptic feedback                                            │
│  └── Face ID / Touch ID unlock                                 │
│                                                                 │
│  📷 Camera Features                                             │
│  ├── Scan printed flashcards                                   │
│  ├── Capture handwritten notes                                 │
│  ├── OCR text recognition                                       │
│  └── Image search                                               │
│                                                                 │
│  🔊 Audio Features                                              │
│  ├── Text-to-speech pronunciation                              │
│  ├── Voice input for answers                                   │
│  └── Background audio playback                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 iOS App Store Features
- [ ] Study flashcards
- [ ] All study modes (Learn, Test, Match, etc.)
- [ ] Create and edit sets
- [ ] Offline mode
- [ ] AI-powered step-by-step explanations
- [ ] Camera scanner
- [ ] Voice pronunciation
- [ ] Progress tracking

---

## 🤖 2. Android App

### 2.1 App Features
```yaml
AndroidApp:
  min_version: Android 8.0+ (API 26)
  
  features:
    # Core
    - flashcard_study: boolean
    - all_study_modes: boolean
    - create_edit_sets: boolean
    - offline_study: boolean
    
    # AI
    - magic_notes: boolean
    - ai_flashcards: boolean
    - expert_solutions: boolean
    
    # Integration
    - google_sign_in: boolean
    - google_classroom: boolean
    - android_widgets: boolean
```

### 2.2 Android-Specific Features
```
┌─────────────────────────────────────────────────────────────────┐
│                 ANDROID SPECIAL FEATURES                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🤖 Android Integration                                        │
│  ├── Google Sign-In                                            │
│  ├── Google Classroom sync                                     │
│  ├── Home screen widgets                                       │
│  ├── Share intent (send to app)                                │
│  └── Material Design 3 UI                                      │
│                                                                 │
│  📱 Device Features                                             │
│  ├── Fingerprint unlock                                        │
│  ├── Camera for OCR                                            │
│  ├── Microphone for voice input                                │
│  └── Notification badges                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🌐 3. Progressive Web App (PWA)

### 3.1 PWA Features
```yaml
PWA:
  service_worker: boolean
  offline_support: boolean
  installable: boolean
  
  capabilities:
    - push_notifications: boolean
    - background_sync: boolean
    - web_share: boolean
    - clipboard_api: boolean
```

### 3.2 PWA Benefits
| Feature | Benefit |
|---------|---------|
| Installable | Add to home screen |
| Offline capable | Work without internet |
| Auto-updates | Always latest version |
| Share targets | Share from other apps |
| Push notifications | Re-engagement |

---

## 📶 4. Offline Mode

### 4.1 Offline Capabilities
```
┌─────────────────────────────────────────────────────────────────┐
│                    OFFLINE FEATURES                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✅ Available Offline:                                          │
│  ├── Flashcard review (Cards mode)                            │
│  ├── Match game                                                 │
│  ├── Previously downloaded sets                                │
│  ├── Progress tracking                                         │
│  └── Created sets (sync when online)                          │
│                                                                 │
│  ❌ Not Available Offline:                                     │
│  ├── Learn mode (adaptive features)                           │
│  ├── Test mode                                                 │
│  ├── Write/Spell mode                                          │
│  ├── AI features                                               │
│  └── Create sets with images/audio                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Offline Storage
```yaml
OfflineStorage:
  downloaded_sets: Set[]
  local_progress: Progress
  pending_changes: Change[]
  
  settings:
    auto_download_wifi: boolean
    storage_limit: integer (MB)
    clear_after_days: integer
```

### 4.3 Offline Settings
- [ ] Download sets for offline
- [ ] Auto-download on WiFi
- [ ] Storage management
- [ ] Clear offline data
- [ ] View offline storage size

---

## 🔄 5. Sync & Data Management

### 5.1 Sync Features
```
┌─────────────────────────────────────────────────────────────────┐
│                    SYNC FEATURES                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📤 Upload Sync                                                 │
│  ├── Created sets sync to cloud                               │
│  ├── Edited cards sync                                         │
│  ├── Deleted items sync                                        │
│  └── Conflict resolution                                       │
│                                                                 │
│  📥 Download Sync                                               │
│  ├── Download for offline                                       │
│  ├── Sync progress data                                        │
│  └── Update downloaded sets                                    │
│                                                                 │
│  🔄 Background Sync                                              │
│  ├── Sync when app opens                                       │
│  ├── Sync when online                                           │
│  └── Scheduled sync                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Sync Settings
| Setting | Description |
|---------|-------------|
| Auto-sync WiFi | Sync chỉ khi WiFi |
| Auto-sync cellular | Sync khi có mạng |
| Sync frequency | Bao lâu sync 1 lần |
| Sync on open | Sync khi mở app |
| Selective sync | Chọn set để sync |

### 5.3 Sync Status Indicators
```
┌─────────────────────────────────────────────────────────────────┐
│  📶 Synced ✓     Set downloaded and up to date                 │
│  ⏳ Syncing...    Currently uploading/downloading               │
│  ⚠️ Pending       Changes waiting to sync                      │
│  ❌ Offline       No connection - changes will sync later        │
│  🔒 Local only    Set only available locally                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📱 6. Mobile UX Features

### 6.1 Touch Interactions
```
┌─────────────────────────────────────────────────────────────────┐
│                    TOUCH INTERACTIONS                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Gestures:                                                      │
│  ├── Swipe left/right    - Navigate cards                      │
│  ├── Tap                  - Flip card                          │
│  ├── Long press           - Edit card                          │
│  ├── Pinch zoom           - Zoom images                        │
│  └── Pull down            - Refresh                            │
│                                                                 │
│  Animations:                                                    │
│  ├── Card flip            - 3D flip animation                   │
│  ├── Swipe out            - Card slides away                   │
│  ├── Match success        - Confetti/celebration               │
│  └── Progress updates     - Smooth progress bar                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Mobile Navigation
| Feature | Description |
|---------|-------------|
| Bottom tab nav | 4-5 tabs chính |
| Hamburger menu | Menu phụ |
| Search bar | Tìm kiếm nhanh |
| Pull to refresh | Kéo để refresh |
| Infinite scroll | Load more |

---

## 🔔 7. Notifications

### 7.1 Notification Types
```yaml
Notifications:
  - study_reminder: "Time to study!"
  - streak_warning: "Don't lose your streak!"
  - due_assignment: "Assignment due soon"
  - new_follower: "Someone followed you"
  - comment_reply: "Reply to your comment"
  - new_set_shared: "New set shared with you"
  - daily_digest: "Daily study summary"
```

### 7.2 Notification Settings
- [ ] Study reminders
- [ ] Streak alerts
- [ ] Assignment notifications
- [ ] Social notifications
- [ ] Marketing/promotional
- [ ] Quiet hours
- [ ] Sound/vibration settings

---

## 📊 8. Performance & Optimization

### 8.1 App Performance
```
┌─────────────────────────────────────────────────────────────────┐
│                    PERFORMANCE OPTIMIZATION                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🚀 Startup                                                      │
│  ├── Cold start < 2 seconds                                    │
│  ├── Warm start < 500ms                                        │
│  └── Splash screen optimization                                 │
│                                                                 │
│  📱 Memory Usage                                                 │
│  ├── Efficient image caching                                    │
│  ├── Lazy loading                                               │
│  └── Memory limit management                                    │
│                                                                 │
│  🔋 Battery                                                      │
│  ├── Background sync optimization                              │
│  ├── Minimal GPS usage                                         │
│  └── Efficient animations                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Data Usage
| Setting | Description |
|---------|-------------|
| Download over WiFi only | Tiết kiệm data |
| Compress images | Giảm kích thước |
| Cache management | Quản lý cache |
| Data saver mode | Chế độ tiết kiệm |

---

## 🔐 9. Security

### 9.1 Mobile Security
```
┌─────────────────────────────────────────────────────────────────┐
│                    MOBILE SECURITY                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🔒 Authentication                                              │
│  ├── Fingerprint / Face ID                                     │
│  ├── PIN / Pattern                                              │
│  ├── Biometric unlock                                           │
│  └── Session timeout                                            │
│                                                                 │
│  📱 Data Protection                                              │
│  ├── Encrypted local storage                                    │
│  ├── Secure API calls                                           │
│  ├── Certificate pinning                                        │
│  └── Root/jailbreak detection                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 10. App Size & Updates

### 10.1 App Specifications
| Platform | Approx Size | Update Frequency |
|----------|-------------|-------------------|
| iOS | ~100MB | Monthly |
| Android | ~80MB | Monthly |
| PWA | ~0MB (on-demand) | Real-time |

### 10.2 Updates
- [ ] Auto-update on WiFi
- [ ] Changelog display
- [ ] Rollback option
- [ ] Beta testing program

---

## 📱 Tiếp Theo

Xem **Game & Thử thách** trong file `08-gamification.md`
