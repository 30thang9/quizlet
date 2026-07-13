# 12 - Bảo Mật & Quyền Riêng Tư (Security & Privacy)

## 📋 Tổng Quan

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY & PRIVACY                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🔐 Account Security        - Bảo vệ tài khoản                 │
│  🔒 Data Encryption         - Mã hóa dữ liệu                  │
│  👤 Privacy Controls       - Kiểm soát quyền riêng tư        │
│  📜 Compliance             - Tuân thủ quy định                 │
│  🍪 Cookie Policy          - Chính sách cookie                 │
│  📋 Data Rights           - Quyền về dữ liệu                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 1. Account Security

### 1.1 Authentication Methods
```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION METHODS                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🔑 Password-Based                                             │
│  ├── Minimum 8 characters                                     │
│  ├── Mix of letters, numbers, symbols                         │
│  └── Strength indicator                                        │
│                                                                 │
│  🔐 Two-Factor Authentication (2FA)                           │
│  ├── SMS verification                                          │
│  ├── Authenticator app (TOTP)                                 │
│  └── Backup codes                                              │
│                                                                 │
│  🌐 Social Login                                               │
│  ├── Google                                                   │
│  ├── Apple                                                    │
│  ├── Facebook                                                 │
│  └── Microsoft                                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Security Features
```yaml
SecurityFeatures:
  authentication:
    - password_requirements: boolean
    - 2fa: boolean
    - social_login: boolean
    - biometric: boolean (mobile)
    
  session:
    - session_timeout: integer (minutes)
    - concurrent_sessions: integer
    - remember_device: boolean
    
  monitoring:
    - login_alerts: boolean
    - suspicious_activity_detection: boolean
    - ip_whitelist: boolean
```

### 1.3 Account Recovery
| Method | Description |
|--------|-------------|
| Email recovery | Link đặt lại qua email |
| Phone recovery | Mã qua SMS |
| Security questions | Câu hỏi bảo mật |
| Identity verification | Xác minh danh tính |

---

## 🔒 2. Data Encryption

### 2.1 Encryption Standards
```
┌─────────────────────────────────────────────────────────────────┐
│                    ENCRYPTION STANDARDS                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🔐 In Transit                                                 │
│  └── TLS 1.2/1.3 for all connections                          │
│                                                                 │
│  🔐 At Rest                                                    │
│  ├── AES-256 encryption for stored data                       │
│  └── Database-level encryption                                 │
│                                                                 │
│  🔑 Key Management                                             │
│  ├── AWS KMS or similar                                        │
│  ├── Key rotation                                              │
│  └── HSM for sensitive keys                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Data Protection
| Layer | Protection |
|-------|------------|
| Network | TLS 1.3, certificate pinning |
| Database | Encryption at rest |
| File storage | AES-256 |
| Backups | Encrypted |
| Mobile | Keychain/Keystore |

---

## 👤 3. Privacy Controls

### 3.1 User Privacy Settings
```yaml
PrivacySettings:
  profile:
    - visibility: "public" | "followers" | "private"
    - show_email: boolean
    - show_study_stats: boolean
    - show_activity: boolean
    
  activity:
    - show_study_activity: boolean
    - show_created_sets: boolean
    - show_on_leaderboards: boolean
    
  communication:
    - allow_comments: boolean
    - allow_messages: boolean
    - allow_follow_requests: boolean
```

### 3.2 Privacy Dashboard
```
┌─────────────────────────────────────────────────────────────────┐
│                    PRIVACY DASHBOARD                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Profile Visibility:                                           │
│  ○ Public - Anyone can see                                      │
│  ● Followers only - Only followers can see                     │
│  ○ Private - Hidden from search                                │
│                                                                 │
│  Activity:                                                     │
│  ☑ Show my study activity                                      │
│  ☑ Show sets I create                                         │
│  ☐ Show my comments on others' sets                          │
│                                                                 │
│  Communication:                                                 │
│  ☑ Allow comments on my sets                                  │
│  ☑ Allow messages from others                                 │
│  ☐ Allow search engines to index my profile                  │
│                                                                 │
│  [Save Changes]                                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.3 Privacy Features
- [ ] Profile visibility controls
- [ ] Activity feed settings
- [ ] Comment controls
- [ ] Message filters
- [ ] Block users
- [ ] Report content
- [ ] Search engine indexing
- [ ] Data download

---

## 📜 4. Compliance & Certifications

### 4.1 Regulatory Compliance
```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPLIANCE FRAMEWORKS                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🇺🇸 FERPA (Family Educational Rights...)                      │
│  ├── Student data protection                                   │
│  ├── Parental rights                                           │
│  └── School official access                                   │
│                                                                 │
│  🇪🇺 GDPR (General Data Protection...)                        │
│  ├── Right to access                                          │
│  ├── Right to erasure                                          │
│  ├── Data portability                                         │
│  └── Consent management                                        │
│                                                                 │
│  🧒 COPPA (Children's Online Privacy...)                      │
│  ├── Age verification                                          │
│  ├── Parental consent                                          │
│  └── Limited data collection                                  │
│                                                                 │
│  🔒 CCPA (California Consumer Privacy...)                      │
│  ├── Right to know                                             │
│  ├── Right to delete                                           │
│  └── Do not sell                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Compliance Features
| Regulation | Features |
|------------|----------|
| FERPA | School agreements, data safeguards |
| GDPR | Consent, erasure, portability |
| COPPA | Age gate, parental consent |
| CCPA | Do not sell, data access |

---

## 🍪 5. Cookie Policy

### 5.1 Cookie Categories
```
┌─────────────────────────────────────────────────────────────────┐
│                    COOKIE CATEGORIES                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🍪 Essential Cookies                                          │
│  ├── Authentication                                            │
│  ├── Security                                                   │
│  └── Core functionality                                        │
│  (Cannot be disabled)                                          │
│                                                                 │
│  📊 Analytics Cookies                                          │
│  ├── Usage statistics                                          │
│  ├── Performance monitoring                                    │
│  └── Feature usage                                             │
│  (Can be disabled)                                             │
│                                                                 │
│  📢 Marketing Cookies                                          │
│  ├── Personalized ads                                          │
│  ├── Campaign measurement                                      │
│  └── Retargeting                                               │
│  (Can be disabled)                                             │
│                                                                 │
│  🔧 Functional Cookies                                         │
│  ├── Preferences                                               │
│  ├── Settings                                                  │
│  └── Remember login                                            │
│  (Can be disabled)                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Cookie Management
- [ ] Cookie consent banner
- [ ] Granular cookie controls
- [ ] Do Not Track support
- [ ] Browser settings respect

---

## 📋 6. Data Rights

### 6.1 User Data Rights
```yaml
UserDataRights:
  access:
    - view_all_data: boolean
    - download_data: boolean
    - data_summary: boolean
    
  control:
    - delete_account: boolean
    - delete_data: boolean
    - restrict_processing: boolean
    
  portability:
    - export_json: boolean
    - export_csv: boolean
```

### 6.2 Data Export Contents
```
┌─────────────────────────────────────────────────────────────────┐
│                    DATA EXPORT CONTENTS                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📄 Profile Information                                         │
│  ├── Name, email, avatar                                       │
│  ├── Privacy settings                                          │
│  └── Security settings                                          │
│                                                                 │
│  📚 Study Sets                                                  │
│  ├── Created sets (terms + definitions)                       │
│  ├── Folders and organization                                  │
│  └── Tags                                                      │
│                                                                 │
│  📊 Activity Data                                               │
│  ├── Study history                                             │
│  ├── Progress data                                            │
│  └── Achievement data                                          │
│                                                                 │
│  💬 Social Data                                                 │
│  ├── Comments                                                  │
│  ├── Follows                                                   │
│  └── Likes                                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.3 Data Rights Features
| Right | Description |
|-------|-------------|
| Access | Xem tất cả dữ liệu |
| Download | Export dữ liệu (JSON/CSV) |
| Delete | Xóa tài khoản/dữ liệu |
| Rectify | Sửa thông tin |
| Restrict | Hạn chế xử lý |
| Portability | Chuyển dữ liệu |

---

## 🗑️ 7. Data Retention & Deletion

### 7.1 Retention Policy
```
┌─────────────────────────────────────────────────────────────────┐
│                    DATA RETENTION                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Active Accounts:                                              │
│  └── Data retained while account is active                     │
│                                                                 │
│  Deleted Accounts:                                             │
│  └── Data deleted within 30 days of deletion request           │
│                                                                 │
│  Backup Retention:                                             │
│  └── Backups retained for 90 days maximum                      │
│                                                                 │
│  Analytics Data:                                                │
│  └── Anonymized after 2 years                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Deletion Process
| Step | Action |
|------|--------|
| 1 | User requests deletion |
| 2 | Confirmation email sent |
| 3 | Grace period (if applicable) |
| 4 | Data marked for deletion |
| 5 | Primary data deleted |
| 6 | Backup data deleted (90 days) |

---

## 🔍 8. Security Monitoring

### 8.1 Security Measures
```yaml
SecurityMonitoring:
  infrastructure:
    - ddos_protection: boolean
    - waf: boolean
    - intrusion_detection: boolean
    - vulnerability_scanning: boolean
    
  application:
    - code_review: boolean
    - penetration_testing: boolean
    - security_audits: boolean
    
  incident_response:
    - security_team: boolean
    - incident_response_plan: boolean
    - breach_notification: boolean
```

### 8.2 Security Features
- [ ] DDoS protection
- [ ] Web Application Firewall
- [ ] Intrusion Detection System
- [ ] Regular security audits
- [ ] Bug bounty program
- [ ] Security incident response

---

## 📝 9. Third-Party Services

### 9.1 Service Providers
```
┌─────────────────────────────────────────────────────────────────┐
│                    THIRD-PARTY PROVIDERS                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Infrastructure:                                                │
│  ├── AWS (cloud hosting)                                       │
│  ├── Cloudflare (CDN, security)                                │
│  └── SendGrid (email)                                          │
│                                                                 │
│  Analytics:                                                    │
│  ├── Google Analytics                                         │
│  └── Mixpanel                                                  │
│                                                                 │
│  AI Services:                                                  │
│  ├── OpenAI (AI features)                                      │
│  └── Google Cloud AI                                           │
│                                                                 │
│  Payment:                                                       │
│  ├── Stripe                                                    │
│  └── PayPal                                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📱 Tiếp Theo

Xem **Kiến Trúc Kỹ Thuật** trong file `13-technical-architecture.md`
