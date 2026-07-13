# 11 - Tích Hợp LMS & API (Integrations)

## 📋 Tổng Quan

```
┌─────────────────────────────────────────────────────────────────┐
│                    INTEGRATIONS                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🎓 LMS Integrations       - Google Classroom, Canvas, Moodle  │
│  🔌 API Access             - Public API cho developers         │
│  🌐 Embed Options          - Nhúng vào website/blog            │
│  📤 Import/Export          - Đồng bộ dữ liệu                    │
│  🔐 SSO/SAML               - Single Sign-On cho trường học     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎓 1. LMS Integrations

### 1.1 Google Classroom
```
┌─────────────────────────────────────────────────────────────────┐
│              GOOGLE CLASSROOM INTEGRATION                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Installation: Google Workspace Marketplace                     │
│  Requirements: Google Workspace for Education Plus              │
│                                                                 │
│  Features:                                                      │
│  ├── 🔗 SSO with Google                                        │
│  ├── 📚 Sync rosters from Classroom                            │
│  ├── 📋 Create assignments in Classroom                        │
│  ├── 📊 Push grades back to Classroom                          │
│  ├── 🎮 Share Quizlet Live games                               │
│  └── 🔔 Notifications in Classroom                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Google Classroom Features
```yaml
GoogleClassroomIntegration:
  authentication:
    - google_sso: boolean
    
  roster_sync:
    - auto_sync: boolean
    - sync_frequency: "daily" | "manual"
    - enrollment_updates: boolean
    
  assignment_integration:
    - create_from_quizlet: boolean
    - import_to_classroom: boolean
    - due_date_sync: boolean
    
  gradebook:
    - push_scores: boolean
    - score_mapping: percentage_to_grade
    - include_attempts: boolean
```

### 1.3 Google Classroom Workflow
```
┌─────────────────────────────────────────────────────────────────┐
│              CLASSROOM WORKFLOW                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Teacher Flow:                                                  │
│  1. Install Quizlet add-on from Marketplace                     │
│  2. Connect Google account                                      │
│  3. Select class to sync                                        │
│  4. Create/assign Quizlet set                                   │
│  5. Post to Google Classroom                                    │
│  6. View grades synced back                                     │
│                                                                 │
│  Student Flow:                                                  │
│  1. Click Quizlet assignment in Classroom                       │
│  2. Redirect to Quizlet (logged in)                            │
│  3. Complete study activity                                    │
│  4. Grade returned to Classroom                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📚 2. Canvas LTI Integration

### 2.1 Canvas Integration
```yaml
CanvasLTI:
  version: LTI 1.3
  
  features:
    - deep_linking: boolean
    - assignment_creation: boolean
    - grade_passing: boolean
    - roster_sync: boolean
    - names_and_roles: boolean
```

### 2.2 Canvas Features
- [ ] LTI 1.3 compliant
- [ ] Deep linking (Content Selection)
- [ ] Assignment creation
- [ ] Grade passback (Assignment Grades)
- [ ] Roster synchronization
- [ ] Multiple canvas instances

---

## 🎓 3. Other LMS Integrations

### 3.1 Supported LMS Platforms
```
┌─────────────────────────────────────────────────────────────────┐
│                    SUPPORTED LMS                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✓ Google Classroom        - Full integration                   │
│  ✓ Canvas                  - LTI 1.3                           │
│  ○ Blackboard              - LTI 1.3 (community)               │
│  ○ Moodle                   - LTI 1.3 (community)              │
│  ○ Schoology               - LTI (community)                  │
│  ○ Brightspace/D2L         - Planned                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 LMS Feature Matrix
| Feature | Google Classroom | Canvas | Blackboard | Moodle |
|---------|-----------------|--------|------------|--------|
| SSO | ✓ | ✓ | ✓ | ✓ |
| Roster Sync | ✓ | ✓ | ○ | ○ |
| Assignment | ✓ | ✓ | ○ | ○ |
| Grade Passback | ✓ | ✓ | ○ | ○ |
| Deep Linking | ✓ | ✓ | ○ | ○ |

---

## 🔌 4. Public API

### 4.1 API Overview
*(Note: Quizlet does not have a widely documented public API)*
```
┌─────────────────────────────────────────────────────────────────┐
│                    API ACCESS (if available)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Status: Limited/Partner API only                               │
│                                                                 │
│  Available for:                                                │
│  ├── Educational partners                                       │
│  ├── Research institutions                                      │
│  └── Approved developers                                        │
│                                                                 │
│  Not publicly available for:                                   │
│  ├── Individual developers                                      │
│  ├── App development                                            │
│  └── Commercial use                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Potential API Endpoints (if available)
```yaml
APIEndpoints:
  authentication:
    - POST /auth/token
    - POST /auth/refresh
    
  users:
    - GET /users/{id}
    - PUT /users/{id}
    
  sets:
    - GET /sets
    - POST /sets
    - GET /sets/{id}
    - PUT /sets/{id}
    - DELETE /sets/{id}
    
  cards:
    - GET /sets/{id}/cards
    - POST /sets/{id}/cards
    - PUT /sets/{id}/cards/{card_id}
    
  classes:
    - GET /classes
    - POST /classes
    - GET /classes/{id}/members
```

### 4.3 API Considerations
| Aspect | Note |
|--------|------|
| Authentication | OAuth 2.0 (if available) |
| Rate Limits | Partner-dependent |
| Data Format | JSON |
| Versioning | v1, v2 |
| Documentation | Partner portal only |

---

## 🌐 5. Embed Options

### 5.1 Embed Methods
```
┌─────────────────────────────────────────────────────────────────┐
│                    EMBED OPTIONS                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📱 iFrame Embed                                                │
│  ├── Copy embed code                                            │
│  ├── Paste into website/blog                                   │
│  └── Responsive sizing                                          │
│                                                                 │
│  🔗 Direct Link                                                 │
│  ├── Shareable URL                                              │
│  ├── Open in app or web                                         │
│  └── QR code generation                                         │
│                                                                 │
│  📝 Widget                                                      │
│  ├── JavaScript widget                                          │
│  ├── Customizable appearance                                    │
│  └── Interactive study modes                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Embed Code Example
```html
<!-- Quizlet Embed -->
<iframe 
  src="https://quizlet.com/12345678/flashcards/embed"
  width="100%" 
  height="500" 
  frameborder="0"
  allowfullscreen>
</iframe>
```

### 5.3 Embed Features
| Feature | Description |
|---------|-------------|
| iFrame embed | Nhúng flashcard |
| Link sharing | Chia sẻ link |
| QR code | Mã QR |
| Social share | Chia sẻ MXH |
| Email share | Chia sẻ email |

---

## 📤 6. Import/Export Options

### 6.1 Import Formats
```
┌─────────────────────────────────────────────────────────────────┐
│                    IMPORT OPTIONS                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📄 Documents                                                    │
│  ├── CSV (comma-separated)                                      │
│  ├── TSV (tab-separated)                                       │
│  ├── TXT (plain text)                                          │
│  ├── PDF                                                        │
│  └── DOC/DOCX                                                   │
│                                                                 │
│  🌐 Web                                                         │
│  ├── URL paste                                                  │
│  └── Web scraping                                               │
│                                                                 │
│  📊 Spreadsheets                                                │
│  └── Excel (.xlsx)                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Export Formats
```yaml
ExportFormats:
  - csv: "Comma-separated values"
  - tsv: "Tab-separated values"
  - txt: "Plain text"
  - json: "JavaScript Object Notation"
  - quizlet: "Quizlet native format"
```

---

## 🔐 7. SSO & Enterprise

### 7.1 Single Sign-On Options
```
┌─────────────────────────────────────────────────────────────────┐
│                    SSO OPTIONS                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🏫 Educational Institutions                                    │
│  ├── Google Workspace                                           │
│  ├── Microsoft Azure AD                                        │
│  ├── Clever                                                     │
│  └── ClassLink                                                  │
│                                                                 │
│  🏢 Enterprise                                                   │
│  ├── SAML 2.0                                                   │
│  ├── OAuth 2.0                                                  │
│  └── LDAP/Active Directory                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Enterprise Features
```yaml
EnterpriseFeatures:
  sso:
    - google_sso: boolean
    - microsoft_sso: boolean
    - saml_sso: boolean
    
  admin:
    - admin_dashboard: boolean
    - user_management: boolean
    - usage_analytics: boolean
    - audit_logs: boolean
    
  security:
    - data_residency: boolean
    - compliance: ["FERPA", "GDPR", "COPPA"]
    - custom_dpa: boolean
```

---

## 🔒 8. Data & Privacy

### 8.1 Compliance Certifications
```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPLIANCE                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🇺🇸 FERPA              - Family Educational Rights...         │
│  🇪🇺 GDPR               - General Data Protection Regulation   │
│  🧒 COPPA              - Children's Online Privacy Protection  │
│  🛡️ SOC 2              - Security compliance                    │
│  🔒 CCPA               - California Consumer Privacy Act       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Data Handling
| Aspect | Description |
|--------|-------------|
| Data Location | Servers in United States |
| Data Retention | Account deletion on request |
| AI Training | User content not used for AI training |
| Third Parties | Limited to service providers |
| Export | Full data export available |

---

## 📊 9. Integration Settings

### 9.1 LMS Configuration
```yaml
LMSConfiguration:
  google_classroom:
    enabled: boolean
    auto_create_classes: boolean
    sync_students: boolean
    
  canvas:
    enabled: boolean
    institution_id: string
    deployment_id: string
```

### 9.2 Sync Settings
| Setting | Description |
|---------|-------------|
| Auto-sync | Tự động đồng bộ |
| Sync frequency | Hàng ngày / Theo yêu cầu |
| Conflict resolution | Ưu tiên LMS / Ưu tiên Quizlet |
| Sync history | Lịch sử đồng bộ |

---

## 📱 Tiếp Theo

Xem **Bảo Mật & Quyền Riêng Tư** trong file `12-security-privacy.md`
