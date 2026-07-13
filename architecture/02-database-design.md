# 02 - Database Design

## 🎯 Database Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE STRATEGY                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PostgreSQL (Primary)                                           │
│  ├── Relational data (Users, Sets, Cards)                       │
│  ├── ACID transactions                                          │
│  ├── Complex queries                                            │
│  └── JSON support for flexible schemas                          │
│                                                                 │
│  Redis (Cache + Sessions)                                       │
│  ├── Session storage                                            │
│  ├── API response caching                                       │
│  ├── Rate limiting                                              │
│  └── Real-time features (Sockets)                               │
│                                                                 │
│  PostgreSQL (Read Replicas)                                     │
│  ├── Read-heavy queries                                         │
│  └── Reporting/Analytics                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗃️ Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         ERD OVERVIEW                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────┐         ┌─────────────┐         ┌─────────────┐  │
│   │  User   │─────────│ StudySet    │─────────│    Card     │  │
│   └────┬────┘         └──────┬──────┘         └─────────────┘  │
│        │                     │                                  │
│        │                     │                                  │
│        ▼                     │                                  │
│   ┌─────────┐         ┌──────┴──────┐         ┌─────────────┐  │
│   │ Follow  │         │  Folder     │         │   Class     │  │
│   └─────────┘         └─────────────┘         └──────┬──────┘  │
│                                                       │         │
│   ┌─────────┐         ┌─────────────┐         ┌──────┴──────┐  │
│   │ Comment │         │    Tag      │         │ Assignment  │  │
│   └─────────┘         └─────────────┘         └─────────────┘  │
│                                                       │         │
│   ┌─────────┐                                         ▼         │
│   │  Like   │                                 ┌─────────────┐  │
│   └─────────┘                                 │ClassMember  │  │
│                                               └─────────────┘  │
│   ┌─────────┐                                               │
│   │Progress │                                               │
│   └─────────┘                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Core Tables

### 1. Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    avatar_url VARCHAR(500),
    bio TEXT,
    role VARCHAR(50) DEFAULT 'free',
    email_verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    
    CONSTRAINT users_role_check CHECK (role IN ('free', 'plus', 'unlimited', 'teacher'))
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### 2. Study Sets Table
```sql
CREATE TABLE study_sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
    
    title VARCHAR(500) NOT NULL,
    description TEXT,
    visibility VARCHAR(50) DEFAULT 'public',
    password_hash VARCHAR(255),
    
    -- Content
    language VARCHAR(50),
    subject VARCHAR(100),
    
    -- Statistics (denormalized)
    card_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    copy_count INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    
    CONSTRAINT study_sets_visibility_check CHECK (visibility IN ('public', 'private', 'password', 'link'))
);

CREATE INDEX idx_study_sets_user ON study_sets(user_id);
CREATE INDEX idx_study_sets_folder ON study_sets(folder_id);
CREATE INDEX idx_study_sets_visibility ON study_sets(visibility);
CREATE INDEX idx_study_sets_subject ON study_sets(subject);
CREATE INDEX idx_study_sets_created ON study_sets(created_at DESC);
```

### 3. Cards Table
```sql
CREATE TABLE cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    study_set_id UUID NOT NULL REFERENCES study_sets(id) ON DELETE CASCADE,
    
    term TEXT NOT NULL,
    definition TEXT NOT NULL,
    
    -- Media
    image_url VARCHAR(500),
    audio_url VARCHAR(500),
    
    -- Diagram (if applicable)
    diagram_id UUID,
    
    -- Position & Status
    position INTEGER DEFAULT 0,
    is_starred BOOLEAN DEFAULT FALSE,
    
    -- SRS Fields
    memory_score DECIMAL(5,2) DEFAULT 0,
    ease_factor DECIMAL(4,2) DEFAULT 2.5,
    interval_days INTEGER DEFAULT 0,
    repetitions INTEGER DEFAULT 0,
    next_review_at TIMESTAMP,
    last_reviewed_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT cards_term_not_empty CHECK (term IS NOT NULL AND term != ''),
    CONSTRAINT cards_definition_not_empty CHECK (definition IS NOT NULL AND definition != '')
);

CREATE INDEX idx_cards_study_set ON cards(study_set_id);
CREATE INDEX idx_cards_position ON cards(study_set_id, position);
CREATE INDEX idx_cards_next_review ON cards(next_review_at) WHERE next_review_at IS NOT NULL;
```

### 4. Folders Table
```sql
CREATE TABLE folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES folders(id) ON DELETE CASCADE,
    
    name VARCHAR(255) NOT NULL,
    color VARCHAR(7) DEFAULT '#3B82F6',
    icon VARCHAR(50),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT folders_name_not_empty CHECK (name IS NOT NULL AND name != '')
);

CREATE INDEX idx_folders_user ON folders(user_id);
CREATE INDEX idx_folders_parent ON folders(parent_id);
```

---

## 📊 Classroom Tables

### 5. Classes Table
```sql
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(100),
    grade_level VARCHAR(50),
    description TEXT,
    
    -- Enrollment
    enrollment_code VARCHAR(10) UNIQUE,
    require_login BOOLEAN DEFAULT TRUE,
    
    -- Settings
    settings JSONB DEFAULT '{}',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_classes_teacher ON classes(teacher_id);
CREATE INDEX idx_classes_enrollment ON classes(enrollment_code);
```

### 6. Class Members Table
```sql
CREATE TABLE class_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    role VARCHAR(50) DEFAULT 'student',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT class_members_unique UNIQUE (class_id, user_id),
    CONSTRAINT class_members_role_check CHECK (role IN ('teacher', 'student'))
);

CREATE INDEX idx_class_members_class ON class_members(class_id);
CREATE INDEX idx_class_members_user ON class_members(user_id);
```

### 7. Assignments Table
```sql
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    study_set_id UUID NOT NULL REFERENCES study_sets(id) ON DELETE CASCADE,
    
    title VARCHAR(255),
    description TEXT,
    
    -- Timing
    due_date TIMESTAMP,
    due_time TIME,
    
    -- Settings
    study_mode VARCHAR(50) DEFAULT 'learn',
    require_completion BOOLEAN DEFAULT TRUE,
    min_score DECIMAL(5,2),
    attempts_allowed INTEGER DEFAULT 1,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT assignments_mode_check CHECK (study_mode IN ('learn', 'flashcards', 'test', 'match'))
);

CREATE INDEX idx_assignments_class ON assignments(class_id);
CREATE INDEX idx_assignments_due ON assignments(due_date);
```

### 8. Assignment Progress Table
```sql
CREATE TABLE assignment_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    status VARCHAR(50) DEFAULT 'not_started',
    score DECIMAL(5,2),
    time_spent_seconds INTEGER,
    attempts INTEGER DEFAULT 0,
    
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT assignment_progress_unique UNIQUE (assignment_id, user_id),
    CONSTRAINT assignment_progress_status_check CHECK (status IN ('not_started', 'in_progress', 'completed'))
);

CREATE INDEX idx_assignment_progress_assignment ON assignment_progress(assignment_id);
CREATE INDEX idx_assignment_progress_user ON assignment_progress(user_id);
```

---

## 📊 Social Tables

### 9. Likes Table
```sql
CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    study_set_id UUID NOT NULL REFERENCES study_sets(id) ON DELETE CASCADE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT likes_unique UNIQUE (user_id, study_set_id)
);

CREATE INDEX idx_likes_study_set ON likes(study_set_id);
CREATE INDEX idx_likes_user ON likes(user_id);
```

### 10. Comments Table
```sql
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    study_set_id UUID NOT NULL REFERENCES study_sets(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    
    content TEXT NOT NULL,
    is_edited BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_study_set ON comments(study_set_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);
```

### 11. Follows Table
```sql
CREATE TABLE follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT follows_unique UNIQUE (follower_id, following_id),
    CONSTRAINT follows_no_self_follow CHECK (follower_id != following_id)
);

CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);
```

---

## 📊 Study Progress Table

### 12. User Progress Table
```sql
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    
    -- Review Data
    memory_score DECIMAL(5,2) DEFAULT 0,
    ease_factor DECIMAL(4,2) DEFAULT 2.5,
    interval_days INTEGER DEFAULT 0,
    repetitions INTEGER DEFAULT 0,
    
    -- Timestamps
    next_review_at TIMESTAMP,
    last_reviewed_at TIMESTAMP,
    reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Study Session
    study_session_id UUID,
    
    CONSTRAINT user_progress_unique UNIQUE (user_id, card_id)
);

CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_card ON user_progress(card_id);
CREATE INDEX idx_user_progress_next_review ON user_progress(next_review_at);
```

### 13. Study Sessions Table
```sql
CREATE TABLE study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    study_set_id UUID REFERENCES study_sets(id) ON DELETE SET NULL,
    
    -- Mode
    mode VARCHAR(50) NOT NULL,
    
    -- Stats
    cards_studied INTEGER DEFAULT 0,
    correct_count INTEGER DEFAULT 0,
    time_spent_seconds INTEGER DEFAULT 0,
    
    -- Results
    score DECIMAL(5,2),
    
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP
);

CREATE INDEX idx_study_sessions_user ON study_sessions(user_id);
CREATE INDEX idx_study_sessions_started ON study_sessions(started_at DESC);
```

---

## 🏷️ Tags Table

### 14. Tags Table
```sql
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    color VARCHAR(7),
    category VARCHAR(100),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tags_name ON tags(name);
```

### 15. Study Set Tags (Junction)
```sql
CREATE TABLE study_set_tags (
    study_set_id UUID NOT NULL REFERENCES study_sets(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    
    PRIMARY KEY (study_set_id, tag_id)
);
```

---

## 🔧 Migrations Strategy

### Naming Convention
```
YYYY_MM_DD_HHMMSS_create_[table_name]_table.sql
YYYY_MM_DD_HHMMSS_add_[column]_to_[table]_table.sql
```

### Example Migration
```sql
-- 2026_07_13_000001_create_users_table.sql

-- UP
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DOWN
DROP TABLE IF EXISTS users;
```

---

## 📊 Indexing Strategy

```sql
-- Composite indexes for common queries
CREATE INDEX idx_study_sets_user_visibility ON study_sets(user_id, visibility);
CREATE INDEX idx_cards_study_position ON cards(study_set_id, position);
CREATE INDEX idx_user_progress_review ON user_progress(user_id, next_review_at);

-- Partial indexes for specific use cases
CREATE INDEX idx_cards_due ON cards(study_set_id, next_review_at) 
    WHERE next_review_at IS NOT NULL;

-- Text search index
CREATE INDEX idx_study_sets_search ON study_sets USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));
```

---

## 🗄️ Partitioning (Future Scale)

```sql
-- Example: Partition user_progress by month
CREATE TABLE user_progress (
    id UUID,
    user_id UUID,
    card_id UUID,
    ...
    reviewed_at TIMESTAMP
) PARTITION BY RANGE (reviewed_at);

CREATE TABLE user_progress_2026_01 PARTITION OF user_progress
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
```
