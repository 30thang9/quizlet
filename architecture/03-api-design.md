# 03 - API Design

## 🎯 API Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                    API ARCHITECTURE                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  REST API (Primary)                                            │
│  ├── CRUD operations                                            │
│  ├── Simple queries                                             │
│  └── Public endpoints                                           │
│                                                                 │
│  GraphQL (Optional - for complex queries)                       │
│  ├── Nested data fetching                                       │
│  ├── Real-time subscriptions                                    │
│  └── Mobile apps                                               │
│                                                                 │
│  WebSocket (Real-time)                                          │
│  ├── Live games (Quizlet Live)                                  │
│  ├── Real-time progress                                         │
│  └── Notifications                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 REST API Structure

### Base URL
```
Production: https://api.quizlet-clone.com/v1
Staging: https://api-staging.quizlet-clone.com/v1
Local: http://localhost:3000/v1
```

### Standard Response Format
```typescript
// Success Response
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

---

## 🔐 Authentication API

### Endpoints

#### POST /auth/register
```typescript
// Request
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}

// Response 201
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "free"
    },
    "tokens": {
      "accessToken": "jwt...",
      "refreshToken": "jwt...",
      "expiresIn": 3600
    }
  }
}
```

#### POST /auth/login
```typescript
// Request
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

// Response 200
{
  "success": true,
  "data": {
    "user": { ... },
    "tokens": { ... }
  }
}
```

#### POST /auth/refresh
```typescript
// Request
{
  "refreshToken": "jwt..."
}

// Response 200
{
  "success": true,
  "data": {
    "accessToken": "new jwt...",
    "expiresIn": 3600
  }
}
```

#### POST /auth/logout
```typescript
// Request (with refreshToken in body or cookie)
{
  "refreshToken": "jwt..."
}

// Response 200
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 👤 Users API

### Endpoints

```
GET    /users/me                 # Get current user profile
PATCH  /users/me                 # Update profile
DELETE /users/me                 # Delete account

GET    /users/:id                # Get user public profile
GET    /users/:id/sets           # Get user's public sets
GET    /users/:id/followers      # Get followers
GET    /users/:id/following      # Get following

POST   /users/:id/follow         # Follow user
DELETE /users/:id/follow         # Unfollow user

POST   /users/me/change-password # Change password
POST   /users/me/avatar          # Upload avatar
```

### Response Examples

#### GET /users/me
```typescript
// Response 200
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://...",
    "bio": "Student at MIT",
    "role": "plus",
    "stats": {
      "totalSets": 45,
      "totalCards": 2500,
      "followers": 120,
      "following": 80,
      "studyStreak": 15
    },
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

## 📚 Study Sets API

### Endpoints

```
GET    /study-sets               # List study sets (search, filter)
POST   /study-sets               # Create study set
GET    /study-sets/:id           # Get study set details
PATCH  /study-sets/:id           # Update study set
DELETE /study-sets/:id           # Delete study set

GET    /study-sets/:id/cards     # Get cards in set
POST   /study-sets/:id/cards    # Add cards
PATCH  /study-sets/:id/cards/:cardId  # Update card
DELETE /study-sets/:id/cards/:cardId  # Delete card

POST   /study-sets/:id/like     # Like study set
DELETE /study-sets/:id/like     # Unlike study set

POST   /study-sets/:id/copy      # Copy study set
POST   /study-sets/:id/share    # Generate share link

GET    /study-sets/:id/comments  # Get comments
POST   /study-sets/:id/comments  # Add comment
DELETE /comments/:id             # Delete comment

POST   /study-sets/import       # Import from file
GET    /study-sets/:id/export   # Export set
```

### Request/Response Examples

#### POST /study-sets
```typescript
// Request
{
  "title": "Biology 101 - Cell Biology",
  "description": "Key vocabulary for cell biology course",
  "visibility": "public",
  "language": "en",
  "subject": "Biology"
}

// Response 201
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Biology 101 - Cell Biology",
    "description": "Key vocabulary for cell biology course",
    "visibility": "public",
    "language": "en",
    "subject": "Biology",
    "cardCount": 0,
    "viewCount": 0,
    "likeCount": 0,
    "user": { "id": "uuid", "name": "John Doe" },
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### POST /study-sets/:id/cards
```typescript
// Request - Single card
{
  "term": "Mitochondria",
  "definition": "The powerhouse of the cell",
  "imageUrl": "https://...",
  "audioUrl": "https://..."
}

// Request - Multiple cards
{
  "cards": [
    { "term": "Mitochondria", "definition": "The powerhouse of the cell" },
    { "term": "Nucleus", "definition": "Contains genetic material" },
    { "term": "Ribosome", "definition": "Protein synthesis site" }
  ]
}

// Response 201
{
  "success": true,
  "data": {
    "cards": [
      { "id": "uuid1", "term": "Mitochondria", "definition": "..." },
      { "id": "uuid2", "term": "Nucleus", "definition": "..." },
      { "id": "uuid3", "term": "Ribosome", "definition": "..." }
    ]
  }
}
```

#### GET /study-sets (with search & pagination)
```typescript
// Query params
// ?q=biology&subject=Biology&visibility=public&sort=popular&page=1&limit=20

// Response 200
{
  "success": true,
  "data": [
    { "id": "uuid1", "title": "...", "cardCount": 45, "likeCount": 120, ... },
    { "id": "uuid2", "title": "...", "cardCount": 30, "likeCount": 85, ... }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 234,
    "totalPages": 12
  }
}
```

---

## 🎴 Study/Play API

### Endpoints

```
GET    /study-sets/:id/learn              # Start learn mode
GET    /study-sets/:id/test              # Start test mode
GET    /study-sets/:id/match             # Start match game
GET    /study-sets/:id/write            # Start write mode
GET    /study-sets/:id/spell            # Start spell mode

POST   /study-sets/:id/learn/progress   # Update progress
POST   /study-sets/:id/learn/complete   # Complete learn session

POST   /study-sets/:id/test/submit      # Submit test answers
GET    /study-sets/:id/test/results/:resultId  # Get test results

POST   /study-sets/:id/match/start      # Start match game
POST   /study-sets/:id/match/answer     # Submit match answer
GET    /study-sets/:id/match/results   # Get match results
```

### Request/Response Examples

#### GET /study-sets/:id/learn
```typescript
// Response 200
{
  "success": true,
  "data": {
    "sessionId": "uuid",
    "studySetId": "uuid",
    "mode": "learn",
    "settings": {
      "includeMultipleChoice": true,
      "includeWritten": true,
      "dailyLimit": 20
    },
    "progress": {
      "cardsRemaining": 15,
      "cardsStudied": 5,
      "correctAnswers": 4
    },
    "cards": [
      {
        "id": "uuid",
        "term": "Mitochondria",
        "definition": "The powerhouse of the cell",
        "questionType": "multiple_choice"
      }
    ]
  }
}
```

#### POST /study-sets/:id/learn/progress
```typescript
// Request
{
  "sessionId": "uuid",
  "cardId": "uuid",
  "result": "correct",  // "correct" | "incorrect"
  "timeSpentMs": 2500,
  "questionType": "multiple_choice",
  "selectedAnswer": "The powerhouse of the cell"
}

// Response 200
{
  "success": true,
  "data": {
    "memoryScore": 85.5,
    "nextReviewAt": "2024-01-02T00:00:00Z",
    "isMastered": false
  }
}
```

---

## 👨‍🏫 Classroom API

### Endpoints

```
# Classes
GET    /classes                      # List my classes
POST   /classes                      # Create class
GET    /classes/:id                  # Get class details
PATCH  /classes/:id                  # Update class
DELETE /classes/:id                  # Delete class

# Members
GET    /classes/:id/members          # List members
POST   /classes/:id/members/invite  # Invite by code
POST   /classes/:id/members          # Add member (teacher)
DELETE /classes/:id/members/:userId  # Remove member

# Assignments
GET    /classes/:id/assignments      # List assignments
POST   /classes/:id/assignments      # Create assignment
GET    /classes/:id/assignments/:assignmentId  # Get assignment
PATCH  /classes/:id/assignments/:assignmentId # Update assignment
DELETE /classes/:id/assignments/:assignmentId # Delete assignment

# Progress (Teacher)
GET    /classes/:id/progress         # Class progress overview
GET    /classes/:id/progress/:userId # Student progress
GET    /classes/:id/progress/export  # Export progress CSV
```

### Request/Response Examples

#### POST /classes
```typescript
// Request
{
  "name": "Biology 101 - Period 3",
  "subject": "Biology",
  "gradeLevel": "10th Grade",
  "description": "Introduction to cell biology"
}

// Response 201
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Biology 101 - Period 3",
    "subject": "Biology",
    "gradeLevel": "10th Grade",
    "enrollmentCode": "BIO3X9",
    "memberCount": 0,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### GET /classes/:id/progress
```typescript
// Response 200
{
  "success": true,
  "data": {
    "class": {
      "id": "uuid",
      "name": "Biology 101"
    },
    "overview": {
      "totalStudents": 25,
      "completedAssignments": 18,
      "averageScore": 78.5,
      "totalStudyTime": "45h 30m"
    },
    "assignments": [
      {
        "id": "uuid",
        "title": "Chapter 1 Review",
        "dueDate": "2024-01-05T00:00:00Z",
        "completionRate": 92,
        "averageScore": 85
      }
    ],
    "mostMissedCards": [
      { "cardId": "uuid", "term": "Mitochondria", "missCount": 12 },
      { "cardId": "uuid", "term": "Photosynthesis", "missCount": 10 }
    ]
  }
}
```

---

## 📊 Progress & Statistics API

### Endpoints

```
GET    /users/me/stats               # My statistics
GET    /users/me/streaks            # My streaks
GET    /users/me/achievements       # My achievements

GET    /study-sets/:id/stats        # Set statistics
GET    /study-sets/:id/analytics    # Set analytics

POST   /study-sessions              # Create session
GET    /study-sessions              # My sessions
GET    /study-sessions/:id          # Session details
```

---

## 🔔 Notifications API

### Endpoints

```
GET    /notifications                # List notifications
GET    /notifications/unread-count  # Unread count
PATCH  /notifications/:id/read       # Mark as read
PATCH  /notifications/read-all      # Mark all as read
DELETE /notifications/:id           # Delete notification
```

---

## 📤 Import/Export API

### Import Endpoints

```
POST   /import/csv                   # Import from CSV
POST   /import/pdf                   # Import from PDF
POST   /import/docx                  # Import from DOCX
POST   /import/url                   # Import from URL
```

### Import Request
```typescript
// POST /import/csv
// Content-Type: multipart/form-data

{
  file: File,  // CSV file
  options: {
    separator: ",",  // or "\t" for TSV
    hasHeader: true,
    termColumn: 0,
    definitionColumn: 1,
    titleColumn: null
  }
}

// Response 202
{
  "success": true,
  "data": {
    "jobId": "uuid",
    "status": "processing",
    "estimatedCards": 150
  }
}
```

### Export Endpoints

```
GET    /study-sets/:id/export?format=csv  # Export as CSV
GET    /study-sets/:id/export?format=json # Export as JSON
GET    /study-sets/:id/export?format=txt  # Export as TXT
```

---

## 🔌 WebSocket Events

### Connection
```javascript
// Socket.IO
const socket = io('wss://api.quizlet-clone.com', {
  auth: { token: 'jwt...' }
});
```

### Events

#### Quizlet Live
```typescript
// Client → Server
{ event: 'join-game', data: { gameCode: 'ABC123' } }
{ event: 'submit-answer', data: { answer: '...' } }

// Server → Client
{ event: 'game-start', data: { questions: [...], teams: [...] } }
{ event: 'new-question', data: { question: {...}, timeLimit: 30 } }
{ event: 'score-update', data: { teamId: '...', score: 100 } }
{ event: 'game-end', data: { winner: {...}, stats: {...} } }
```

#### Real-time Progress
```typescript
// Server → Client
{ event: 'card-reviewed', data: { cardId: '...', score: 85 } }
{ event: 'streak-update', data: { streak: 15, isMilestone: true } }
{ event: 'achievement-unlocked', data: { achievement: {...} } }
```

---

## 📝 API Versioning

### Strategy
```
URL Path Versioning: /v1, /v2, /v3
```

### Deprecation Policy
1. **Announce deprecation** - 6 months before removal
2. **Add deprecation headers** - `Deprecation: true`, `Sunset: <date>`
3. **Maintain old versions** - For minimum 12 months
4. **Provide migration guide** - In documentation

---

## 🔒 Rate Limiting

```typescript
// Limits
const RATE_LIMITS = {
  // Auth
  '/auth/register': { windowMs: 3600000, max: 5 },     // 5/hour
  '/auth/login': { windowMs: 3600000, max: 10 },        // 10/hour
  
  // General
  '/**': { windowMs: 60000, max: 100 },                 // 100/min
  
  // Premium
  '/**': { windowMs: 60000, max: 500 },                 // 500/min (premium)
};
```

### Response Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1700000000
```
