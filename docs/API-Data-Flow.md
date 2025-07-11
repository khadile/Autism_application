# BuddyBot - API & Data Flow Diagram

## 🗺️ System Architecture Overview

BuddyBot is designed as an offline-first mobile application with optional cloud synchronization for enhanced features. The architecture prioritizes privacy, accessibility, and consistent performance for autistic users.

---

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    BuddyBot Mobile App                     │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │  Presentation   │  │   Business      │  │    Data     │ │
│  │     Layer       │  │     Logic       │  │   Layer     │ │
│  │                 │  │                 │  │             │ │
│  │ • Screens       │  │ • AI Service    │  │ • SQLite    │ │
│  │ • Components    │  │ • Activities    │  │ • AsyncStorage│ │
│  │ • Navigation    │  │ • Progress      │  │ • File System│ │
│  │                 │  │ • Avatar        │  │             │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                Optional Cloud Services                  │ │
│  │                                                         │ │
│  │ • Progress Sync    • Content Updates   • AI Enhancement│ │
│  │ • Backup/Restore   • Analytics         • Community     │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Patterns

### 1. User Onboarding Flow

```
User Opens App
     ↓
Check First Launch
     ↓
[New User] → Create Profile
     ↓
Avatar Creation
     ↓
Goal Setting
     ↓
Accessibility Preferences
     ↓
Save to Local Storage
     ↓
Initialize Home Screen

Data Stored:
- User preferences
- Avatar configuration
- Learning goals
- Accessibility settings
```

### 2. Activity Flow

```
User Selects Activity
     ↓
Load Activity Data (Local)
     ↓
Present Activity Interface
     ↓
User Interactions
     ↓
Track Progress Locally
     ↓
Calculate Scores
     ↓
Update Progress Database
     ↓
Check Badge Criteria
     ↓
Award Badges (if earned)
     ↓
Display Feedback
     ↓
[Optional] Sync to Cloud

Data Stored:
- Activity responses
- Completion times
- Scores and progress
- Badge achievements
- Session metadata
```

### 3. AI Companion Flow

```
User Sends Message
     ↓
Parse Input (Text/Voice)
     ↓
Process with AI Service
     ↓
Generate Response
     ↓
Check for Activity Suggestions
     ↓
Format Response
     ↓
Display to User
     ↓
Log Conversation
     ↓
Update User Context

Data Stored:
- Conversation history
- User mood/state
- Response quality
- Context information
```

---

## 🗄️ Data Models

### User Profile
```typescript
interface UserProfile {
  id: string;
  username: string;
  age_range: '6-12' | '13-18' | '19-24';
  created_at: Date;
  updated_at: Date;
  preferences: UserPreferences;
  avatar: AvatarConfiguration;
  goals: LearningGoal[];
}

interface UserPreferences {
  voice_enabled: boolean;
  sound_enabled: boolean;
  haptic_enabled: boolean;
  reduced_motion: boolean;
  high_contrast: boolean;
  font_size: 'small' | 'medium' | 'large' | 'extra_large';
  language: string;
  communication_style: 'text' | 'voice' | 'both';
}

interface AvatarConfiguration {
  base_character: string;
  hair_style: string;
  clothing: string;
  accessories: string[];
  colors: {
    hair: string;
    skin: string;
    clothes: string;
  };
  expressions: string[];
  backgrounds: string[];
}
```

### Activity Data
```typescript
interface Activity {
  id: string;
  type: 'flashcards' | 'roleplay' | 'breathing' | 'story';
  title: string;
  description: string;
  age_range: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  content: ActivityContent;
  completion_criteria: CompletionCriteria;
}

interface ActivitySession {
  id: string;
  user_id: string;
  activity_id: string;
  started_at: Date;
  completed_at: Date | null;
  responses: ActivityResponse[];
  score: number;
  completed: boolean;
}

interface ActivityResponse {
  question_id: string;
  user_response: string;
  correct_answer: string;
  is_correct: boolean;
  response_time: number;
  attempts: number;
}
```

### Progress Tracking
```typescript
interface ProgressData {
  user_id: string;
  skill_area: 'social' | 'emotional' | 'communication' | 'self_regulation';
  current_level: number;
  total_activities: number;
  completed_activities: number;
  average_score: number;
  last_activity_date: Date;
  streak_count: number;
  badges_earned: Badge[];
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned_at: Date;
  category: 'progress' | 'skill' | 'consistency' | 'special';
}
```

---

## 🔧 Service Layer Architecture

### AI Service
```typescript
class AIService {
  // Local AI processing for basic responses
  async processMessage(message: string, context: UserContext): Promise<AIResponse> {
    // Rule-based response generation
    // Mood analysis
    // Activity suggestions
    // Context awareness
  }

  // Optional cloud AI for advanced features
  async enhancedProcessing(message: string): Promise<AIResponse> {
    // Advanced NLP
    // Personalized responses
    // Learning adaptation
  }
}

interface AIResponse {
  text: string;
  suggested_activities: string[];
  mood_assessment: MoodLevel;
  follow_up_questions: string[];
  emotion_detection: EmotionType;
}
```

### Activity Service
```typescript
class ActivityService {
  async loadActivity(activityId: string): Promise<Activity> {
    // Load from local storage
    // Adapt to user preferences
    // Apply accessibility settings
  }

  async saveProgress(session: ActivitySession): Promise<void> {
    // Save to local database
    // Update progress metrics
    // Check badge criteria
    // Trigger celebrations
  }

  async generateReport(timeframe: string): Promise<ProgressReport> {
    // Analyze local data
    // Generate insights
    // Create visualizations
  }
}
```

### Avatar Service
```typescript
class AvatarService {
  async updateAvatar(changes: Partial<AvatarConfiguration>): Promise<void> {
    // Validate changes
    // Check unlock status
    // Save to local storage
    // Update UI
  }

  async unlockItems(badges: Badge[]): Promise<string[]> {
    // Check unlock criteria
    // Award new items
    // Notify user
    // Update available items
  }
}
```

---

## 💾 Local Storage Strategy

### SQLite Database Schema

```sql
-- User Profile Table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  age_range TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  preferences TEXT, -- JSON
  avatar_config TEXT, -- JSON
  goals TEXT -- JSON
);

-- Activity Sessions Table
CREATE TABLE activity_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  activity_id TEXT NOT NULL,
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  responses TEXT, -- JSON
  score INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Progress Tracking Table
CREATE TABLE progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  skill_area TEXT NOT NULL,
  current_level INTEGER DEFAULT 1,
  total_activities INTEGER DEFAULT 0,
  completed_activities INTEGER DEFAULT 0,
  average_score REAL DEFAULT 0,
  last_activity_date DATETIME,
  streak_count INTEGER DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Badges Table
CREATE TABLE badges (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  badge_type TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  category TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Conversation History Table
CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  mood_assessment TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### AsyncStorage Usage

```typescript
// User preferences and settings
const STORAGE_KEYS = {
  USER_PREFERENCES: '@BuddyBot:preferences',
  AVATAR_CONFIG: '@BuddyBot:avatar',
  ONBOARDING_COMPLETE: '@BuddyBot:onboarding',
  LAST_BACKUP: '@BuddyBot:last_backup',
  ACCESSIBILITY_SETTINGS: '@BuddyBot:accessibility',
  CONTENT_VERSION: '@BuddyBot:content_version'
};

class StorageService {
  async saveUserPreferences(preferences: UserPreferences): Promise<void> {
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_PREFERENCES,
      JSON.stringify(preferences)
    );
  }

  async getUserPreferences(): Promise<UserPreferences | null> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    return data ? JSON.parse(data) : null;
  }
}
```

---

## 🌐 Optional Cloud Services

### Data Synchronization
```typescript
interface CloudSyncService {
  // Backup user data
  backup(userData: UserData): Promise<SyncResult>;
  
  // Restore user data
  restore(userId: string): Promise<UserData>;
  
  // Sync progress across devices
  syncProgress(progress: ProgressData[]): Promise<SyncResult>;
  
  // Check for content updates
  checkContentUpdates(): Promise<ContentUpdate[]>;
}

interface SyncResult {
  success: boolean;
  timestamp: Date;
  conflicts: SyncConflict[];
  errors: string[];
}
```

### Analytics Service
```typescript
interface AnalyticsService {
  // Anonymous usage analytics
  trackActivityCompletion(activityType: string, duration: number): Promise<void>;
  
  // Feature usage tracking
  trackFeatureUsage(feature: string, context: string): Promise<void>;
  
  // Performance metrics
  trackPerformanceMetrics(metrics: PerformanceData): Promise<void>;
  
  // Privacy-preserving analytics
  anonymizeData(data: any): Promise<AnonymizedData>;
}
```

---

## 🔄 Data Flow Scenarios

### Scenario 1: Daily Check-In
```
1. User opens app
2. AI companion greets user
3. User selects mood (stored locally)
4. AI suggests activities based on mood
5. User selects activity
6. Activity data loaded from local storage
7. User completes activity
8. Progress updated in local database
9. Badges checked and awarded
10. Celebration shown
11. Data optionally synced to cloud
```

### Scenario 2: Avatar Customization
```
1. User navigates to avatar screen
2. Current avatar config loaded from storage
3. User selects new item
4. System checks if item is unlocked
5. If unlocked, apply changes
6. Save new configuration locally
7. Update avatar across app
8. Show success feedback
9. Sync changes to cloud (optional)
```

### Scenario 3: Progress Review
```
1. User accesses progress screen
2. Query local database for recent activities
3. Calculate progress metrics
4. Generate progress visualizations
5. Show achievements and badges
6. Suggest next activities
7. Allow detailed drill-down
8. Export progress report (optional)
```

---

## 🛡️ Privacy & Security

### Data Protection
```typescript
class DataProtectionService {
  // Encrypt sensitive data
  encrypt(data: string): string {
    // Use device keychain/keystore
    // AES-256 encryption
    // Secure key management
  }

  // Anonymize user data
  anonymize(data: UserData): AnonymizedData {
    // Remove identifying information
    // Hash sensitive fields
    // Aggregate data points
  }

  // Secure data transmission
  secureTransmit(data: any): Promise<void> {
    // HTTPS only
    // Certificate pinning
    // Request signing
  }
}
```

### Privacy Controls
```typescript
interface PrivacySettings {
  data_collection_enabled: boolean;
  analytics_enabled: boolean;
  cloud_sync_enabled: boolean;
  data_retention_days: number;
  parental_controls: ParentalControls;
}

interface ParentalControls {
  enabled: boolean;
  progress_sharing: boolean;
  activity_restrictions: string[];
  time_limits: TimeLimits;
}
```

---

## 📱 Platform Integration

### iOS Integration
```typescript
// iOS-specific features
class iOSIntegration {
  // HealthKit integration for wellness data
  async shareWellnessData(data: WellnessData): Promise<void> {
    // Optional wellness tracking
    // Mood and activity correlation
    // Privacy-first approach
  }

  // Shortcuts integration
  async createShortcuts(): Promise<void> {
    // Quick access to calm-down corner
    // Voice-activated activities
    // Siri integration
  }
}
```

### Android Integration
```typescript
// Android-specific features
class AndroidIntegration {
  // Accessibility services
  async setupAccessibilityServices(): Promise<void> {
    // TalkBack integration
    // Switch navigation support
    // Voice access compatibility
  }

  // Widget support
  async createWidgets(): Promise<void> {
    // Progress widget
    // Quick activity access
    // Mood check-in widget
  }
}
```

---

## 🔧 Development Tools

### API Documentation
```typescript
// OpenAPI specification for future cloud services
interface BuddyBotAPI {
  '/api/v1/users': {
    POST: (userData: UserData) => Promise<User>;
    GET: (userId: string) => Promise<User>;
    PUT: (userId: string, updates: Partial<UserData>) => Promise<User>;
  };
  
  '/api/v1/activities': {
    GET: (filters: ActivityFilters) => Promise<Activity[]>;
    POST: (activityData: ActivityData) => Promise<Activity>;
  };
  
  '/api/v1/progress': {
    GET: (userId: string) => Promise<ProgressData[]>;
    POST: (progressData: ProgressData) => Promise<void>;
  };
}
```

### Testing Strategy
```typescript
// Mock services for testing
class MockAIService implements AIService {
  async processMessage(message: string): Promise<AIResponse> {
    // Predictable responses for testing
    // Various scenario coverage
    // Edge case handling
  }
}

class MockStorageService implements StorageService {
  private mockData: Map<string, any> = new Map();
  
  async save(key: string, data: any): Promise<void> {
    this.mockData.set(key, data);
  }
  
  async load(key: string): Promise<any> {
    return this.mockData.get(key);
  }
}
```

---

## 📊 Performance Considerations

### Optimization Strategies
```typescript
class PerformanceOptimizer {
  // Lazy loading for activities
  async loadActivityOnDemand(activityId: string): Promise<Activity> {
    // Cache frequently used activities
    // Preload based on user patterns
    // Optimize for slow devices
  }

  // Image optimization
  async optimizeImages(): Promise<void> {
    // WebP format support
    // Multiple resolutions
    // Lazy loading implementation
  }

  // Database optimization
  async optimizeDatabase(): Promise<void> {
    // Index optimization
    // Query optimization
    // Periodic cleanup
  }
}
```

### Monitoring & Alerting
```typescript
interface PerformanceMetrics {
  app_start_time: number;
  activity_load_time: number;
  database_query_time: number;
  memory_usage: number;
  crash_reports: CrashReport[];
}

class PerformanceMonitor {
  async trackMetrics(metrics: PerformanceMetrics): Promise<void> {
    // Local performance tracking
    // Anonymous reporting
    // Performance regression detection
  }
}
```

This comprehensive API and data flow design ensures BuddyBot provides a robust, privacy-focused, and scalable architecture while maintaining the offline-first approach essential for consistent user experience. 