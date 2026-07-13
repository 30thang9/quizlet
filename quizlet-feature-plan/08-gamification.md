# 08 - Game & Thử Thách (Gamification)

## 📋 Tổng Quan

```
┌─────────────────────────────────────────────────────────────────┐
│                    GAMIFICATION FEATURES                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🎮 Quizlet Live           - Game multiplayer real-time        │
│  🔗 Match Mode            - Trò chơi ghép thẻ có thưởng       │
│  🚀 Gravity Mode          - Game bắn asteroid                  │
│  🏆 Streaks & Achievements - Phần thưởng & streak              │
│  📊 Leaderboards          - Bảng xếp hạng                      │
│  🎁 Challenges            - Thử thách hàng ngày/tuần           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎮 1. Quizlet Live

### 1.1 Game Overview
Quizlet Live là game học tập real-time, collaborative dành cho lớp học.

```
┌─────────────────────────────────────────────────────────────────┐
│                    QUIZLET LIVE OVERVIEW                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Type: Real-time multiplayer game                               │
│  Players: 2-50+ students                                        │
│  Duration: 10-15 minutes                                        │
│  Format: Race to answer correctly                               │
│                                                                 │
│  Goal: First team to match all terms wins!                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 How It Works
```
┌─────────────────────────────────────────────────────────────────┐
│                 QUIZLET LIVE FLOW                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  TEACHER SIDE:                                                  │
│  1. Select study set                                            │
│  2. Choose game mode (Collaborative/Competitive)              │
│  3. Generate 6-letter code                                     │
│  4. Share code with students                                    │
│  5. Monitor game on projector                                   │
│  6. Review results after game                                   │
│                                                                 │
│  STUDENT SIDE:                                                  │
│  1. Go to quizlet.com/live                                     │
│  2. Enter game code                                             │
│  3. Enter name                                                  │
│  4. Wait for team assignment                                    │
│  5. Answer questions on phone/computer                         │
│  6. Celebrate win!                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 Team Formation
```
┌─────────────────────────────────────────────────────────────────┐
│                    TEAM FORMATION                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Auto-Balance (Recommended):                                    │
│  └── Teams formed randomly with mixed ability                  │
│                                                                 │
│  Random:                                                        │
│  └── Completely random team assignment                         │
│                                                                 │
│  Self-select:                                                   │
│  └── Students pick their own teams                             │
│                                                                 │
│  Teacher-assigned:                                              │
│  └── Teacher manually assigns teams                            │
│                                                                 │
│  Number of teams: [3 ▼]                                        │
│  Players per team: [3-5 ▼]                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.4 Live Game Mechanics
```yaml
QuizletLiveSession:
  code: string (6 letters)
  status: "waiting" | "in_progress" | "completed"
  
  settings:
    mode: "collaborative" | "competitive"
    team_count: integer
    questions_for_win: integer (usually 12)
    
  scoring:
    correct_answer: +100 points
    streak_bonus: +10 per consecutive
    speed_bonus: based on answer time
```

### 1.5 Live Features
| Feature | Description |
|---------|-------------|
| Real-time sync | Cập nhật tức thì |
| Team chat | Trò chuyện trong nhóm |
| Progress bar | Thanh tiến độ mỗi team |
| Leaderboard | Bảng xếp hạng live |
| Sound effects | Âm thanh feedback |
| Celebration animations | Hiệu ứng chiến thắng |
| Post-game review | Xem lại sau game |

---

## 🔗 2. Match Game Features

### 2.1 Match Mode Gamification
```
┌─────────────────────────────────────────────────────────────────┐
│                    MATCH GAMEFEEL                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ⏱️ Timed Challenge                                              │
│  ├── Race against the clock                                     │
│  ├── Beat your personal best                                   │
│  └── Unlock achievements                                         │
│                                                                 │
│  ⚡ Combo System                                                 │
│  ├── Consecutive correct matches                               │
│  ├── Combo multiplier                                          │
│  └── Break combos with mistakes                                 │
│                                                                 │
│  🎯 Difficulty Levels                                           │
│  ├── Easy: 60 seconds, 5 cards                                 │
│  ├── Medium: 45 seconds, 10 cards                             │
│  └── Hard: 30 seconds, 15+ cards                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Match Scoring
```yaml
MatchScoring:
  base_points: 10 per match
  time_bonus: (remaining_seconds * 0.5)
  combo_multiplier: combo_count * 1.5
  
  penalties:
    wrong_match: -5 points
    hint_used: -50% time bonus
```

### 2.3 Match Rewards
| Reward | Requirement |
|--------|------------|
| ⭐ First Match | Complete first game |
| 🔥 5-Streak | 5 consecutive correct |
| ⚡ Speed Demon | Under 10 seconds |
| 🎯 Perfect Game | 0 mistakes |
| 🏆 Daily Champion | Best score of the day |

---

## 🚀 3. Gravity Mode (Deprecated/Merged)

### 3.1 Game Concept
*(Note: Gravity mode has been deprecated and features merged into Match)*

Gravity là game bắn asteroid với từ vựng.

```
┌─────────────────────────────────────────────────────────────────┐
│                    GRAVITY GAME                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Gameplay:                                                      │
│  ├── Asteroids fall with terms                                  │
│  ├── Match with correct definitions                            │
│  ├── Don't let asteroids hit ground                            │
│  └── Combo for speed bonus                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏆 4. Streaks & Achievements

### 4.1 Streak System
```
┌─────────────────────────────────────────────────────────────────┐
│                    STREAK SYSTEM                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🔥 Current Streak: 12 days                                     │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  M  T  W  T  F  S  S  M  T  W  T  F  S  S              │   │
│  │  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ○  ○              │   │
│  │  └─────────────── 12 days ───────────┘                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Study today to keep your streak alive!                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Streak Features
| Feature | Description |
|---------|-------------|
| Daily streak | Số ngày học liên tiếp |
| Streak freeze | Bảo vệ streak khi nghỉ |
| Streak milestones | 7, 30, 100, 365 ngày |
| Streak reminders | Nhắc nhở học |
| Streak lost | Thông báo khi mất |

### 4.3 Achievements
```
┌─────────────────────────────────────────────────────────────────┐
│                    ACHIEVEMENT EXAMPLES                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📚 Study Achievements                                          │
│  ├── "First Steps" - Complete first study session              │
│  ├── "Dedicated" - Study 1 hour total                          │
│  ├── "Marathon" - Study 50 cards in one session                │
│  └── "Night Owl" - Study after midnight                        │
│                                                                 │
│  🏅 Milestone Achievements                                      │
│  ├── "Century" - Learn 100 cards                              │
│  ├── "Thousandaire" - Learn 1,000 cards                       │
│  └── "Master" - Master 500 cards                               │
│                                                                 │
│  🔥 Streak Achievements                                         │
│  ├── "Week Warrior" - 7-day streak                            │
│  ├── "Month Master" - 30-day streak                            │
│  └── "Year Champion" - 365-day streak                          │
│                                                                 │
│  🎮 Game Achievements                                           │
│  ├── "Speed Demon" - Match in under 5 seconds                  │
│  ├── "Perfect Match" - 100% accuracy                          │
│  └── "Live Winner" - Win a Quizlet Live game                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.4 Achievement Types
| Category | Examples |
|----------|----------|
| Learning | Cards learned, sets completed |
| Consistency | Daily streaks |
| Social | Followers, sets shared |
| Games | Scores, wins |
| Creation | Sets created |
| Exploration | Features tried |

---

## 📊 5. Leaderboards

### 5.1 Leaderboard Types
```
┌─────────────────────────────────────────────────────────────────┐
│                    LEADERBOARD TYPES                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🌍 Global Leaderboard                                          │
│  ├── All-time top studiers                                     │
│  ├── By subject/topic                                          │
│  └── Weekly/Monthly/All-time                                    │
│                                                                 │
│  👥 Friends Leaderboard                                          │
│  ├── Compare with followed users                                │
│  └── Weekly challenges                                          │
│                                                                 │
│  🏫 Class Leaderboard                                           │
│  ├── Class members only                                        │
│  └── For assignments                                           │
│                                                                 │
│  🎮 Game Leaderboards                                           │
│  ├── Match high scores                                         │
│  └── Live game wins                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Leaderboard Features
- [ ] Global rankings
- [ ] Friends rankings
- [ ] Weekly/Monthly/All-time
- [ ] Subject-specific
- [ ] Game mode rankings
- [ ] Class rankings
- [ ] Privacy controls (hide me)

---

## 🎁 6. Challenges

### 6.1 Challenge Types
```
┌─────────────────────────────────────────────────────────────────┐
│                    CHALLENGE TYPES                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📅 Daily Challenges                                            │
│  ├── Study 10 cards                                            │
│  ├── Complete 1 Learn session                                 │
│  └── Play 1 Match game                                        │
│                                                                 │
│  📈 Weekly Challenges                                           │
│  ├── 7-day streak                                              │
│  ├── Master 50 cards                                          │
│  └── Create a new set                                         │
│                                                                 │
│  🏆 Special Challenges                                          │
│  ├── Holiday events                                           │
│  ├── Subject-specific weeks                                   │
│  └── Milestone celebrations                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Challenge Features
| Feature | Description |
|---------|-------------|
| Daily goals | Mục tiêu mỗi ngày |
| Progress tracking | Theo dõi tiến độ |
| Rewards | Phần thưởng khi hoàn thành |
| Reminders | Nhắc nhở challenge |
| Social sharing | Chia sẻ thành tích |

---

## 🎨 7. Visual Rewards

### 7.1 Celebration Animations
```
┌─────────────────────────────────────────────────────────────────┐
│                    REWARD ANIMATIONS                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🎉 Perfect Score                                               │
│  └── Confetti explosion, trophy animation                       │
│                                                                 │
│  🔥 Streak Milestone                                            │
│  └── Fire animation, badge unlock                              │
│                                                                 │
│  ⭐ Achievement Unlocked                                        │
│  └── Badge pop, sparkle effect                                 │
│                                                                 │
│  🏆 Match Win                                                   │
│  └── Trophy, cheer sound                                        │
│                                                                 │
│  📚 Mastery Reached                                             │
│  └── Star burst, progress bar fill                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Reward Types
| Type | Example |
|------|---------|
| Badges | Achievement icons |
| Titles | "Streak Master", "Quiz Champion" |
| Profile decorations | Special borders, badges |
| In-app currency | Points, coins |
| Real rewards | Gift cards, merch (rare) |

---

## 🎮 8. Game Settings

### 8.1 Customization Options
```yaml
GameSettings:
  sound:
    effects: boolean
    music: boolean
    voice: boolean
    
  notifications:
    challenge_reminders: boolean
    streak_alerts: boolean
    
  difficulty:
    default_mode: "easy" | "medium" | "hard"
    adaptive_difficulty: boolean
    
  privacy:
    show_on_leaderboards: boolean
    share_progress: boolean
```

---

## 📱 Tiếp Theo

Xem **Tổ Chức - Folders, Tags, Search** trong file `09-organization.md`
