# BuddyBot - Storage Architecture Documentation

## 🏗️ **Architecture Overview**

BuddyBot implements a **hybrid local-first + cloud sync** storage architecture designed specifically for autism support applications. This approach ensures:

- ✅ **Offline-First**: Full functionality without internet dependency
- ✅ **Multi-Device**: Seamless experience across devices  
- ✅ **Privacy-Focused**: Encrypted sensitive data with user control
- ✅ **Autism-Friendly**: No interruptions during therapeutic activities
- ✅ **COPPA Compliant**: Special protections for users under 13

---

## 📊 **Storage Layers**

### **Layer 1: SQLite Database (Primary Storage)**

**Purpose**: Core data persistence, immediate access, offline functionality

```sql
-- Core Tables with Sync Support

-- User Profile Management
CREATE TABLE user_profile (
  id TEXT PRIMARY KEY,              -- UUID for global identification
  user_id TEXT UNIQUE,              -- Cloud account identifier
  display_name TEXT,                -- User's chosen name
  age_group TEXT,                   -- '6-12', '13-18', '19-24'
  guardian_email TEXT,              -- Required for minors (COPPA)
  created_at DATETIME,
  updated_at DATETIME,
  synced_at DATETIME,
  sync_status TEXT DEFAULT 'pending',
  
  -- Profile Data (JSON)
  avatar_config TEXT,               -- Avatar customization
  accessibility_preferences TEXT,   -- User accessibility settings
  selected_goals TEXT,              -- Therapeutic goals
  privacy_settings TEXT             -- Data sharing preferences
);

-- Activity Session Tracking
CREATE TABLE activity_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  activity_type TEXT,               -- 'flashcards', 'breathing', 'role_play'
  activity_subtype TEXT,            -- Specific activity variant
  started_at DATETIME,
  completed_at DATETIME,
  duration_seconds INTEGER,
  
  -- Performance Metrics
  score INTEGER,                    -- Activity-specific score
  accuracy_percentage REAL,        -- Correctness percentage
  difficulty_level INTEGER,        -- 1-5 difficulty
  
  -- Emotional Context
  mood_before TEXT,                 -- Pre-activity emotional state
  mood_after TEXT,                  -- Post-activity emotional state
  stress_level_before INTEGER,      -- 1-10 scale
  stress_level_after INTEGER,       -- 1-10 scale
  
  -- Technical Metadata
  device_id TEXT,
  app_version TEXT,
  created_at DATETIME,
  updated_at DATETIME,
  synced_at DATETIME,
  sync_status TEXT DEFAULT 'pending',
  
  FOREIGN KEY (user_id) REFERENCES user_profile(user_id)
);

-- Skill Progress Tracking
CREATE TABLE skill_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  skill_category TEXT,              -- 'social_skills', 'emotions', 'communication', 'self_regulation'
  skill_subcategory TEXT,           -- More specific skill area
  
  -- Progress Metrics
  current_level INTEGER,            -- 1-10 proficiency level
  progress_percentage REAL,         -- 0.0-100.0
  sessions_completed INTEGER,       -- Total sessions in this skill
  
  -- Milestones & Achievements
  milestones_reached TEXT,          -- JSON array of achieved milestones
  last_milestone_date DATETIME,
  next_milestone_target TEXT,
  
  -- Assessment Data
  assessment_results TEXT,          -- JSON: detailed performance data
  strengths TEXT,                   -- JSON: identified strengths
  areas_for_growth TEXT,            -- JSON: areas needing focus
  
  -- Sync Metadata
  last_updated DATETIME,
  device_id TEXT,
  created_at DATETIME,
  updated_at DATETIME,
  synced_at DATETIME,
  sync_status TEXT DEFAULT 'pending',
  
  FOREIGN KEY (user_id) REFERENCES user_profile(user_id)
);

-- AI Chat Conversation History
CREATE TABLE chat_messages (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  conversation_session_id TEXT,     -- Group related messages
  
  -- Message Content (Encrypted for cloud)
  message_text TEXT,                -- User message or bot response
  message_type TEXT,                -- 'user', 'bot', 'system'
  is_bot_message BOOLEAN,
  
  -- Context & Metadata
  timestamp DATETIME,
  mood_context TEXT,                -- User's mood during conversation
  activity_context TEXT,            -- Related activity if applicable
  intent_category TEXT,             -- 'support', 'instruction', 'celebration'
  
  -- Therapeutic Value
  therapeutic_goal TEXT,            -- Goal this conversation supports
  intervention_type TEXT,           -- Type of therapeutic intervention
  effectiveness_rating INTEGER,     -- 1-5 how helpful was this
  
  -- Technical Metadata
  device_id TEXT,
  created_at DATETIME,
  synced_at DATETIME,
  sync_status TEXT DEFAULT 'pending',
  
  FOREIGN KEY (user_id) REFERENCES user_profile(user_id)
);

-- Achievement & Badge System
CREATE TABLE achievements (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  
  -- Achievement Details
  achievement_type TEXT,            -- 'participation', 'progress', 'consistency', 'milestone'
  badge_category TEXT,              -- 'first_time', 'streak', 'improvement', 'mastery'
  badge_name TEXT,                  -- 'First Activity', 'Week Warrior', etc.
  badge_icon TEXT,                  -- Icon identifier
  
  -- Achievement Context
  earned_at DATETIME,
  activity_trigger TEXT,            -- What activity earned this
  skill_related TEXT,               -- Which skill area this relates to
  
  -- Motivational Data
  celebration_shown BOOLEAN,        -- Was achievement celebrated
  shared_with_guardian BOOLEAN,     -- Shared with parent/caregiver
  
  -- Sync Metadata
  device_id TEXT,
  created_at DATETIME,
  synced_at DATETIME,
  sync_status TEXT DEFAULT 'pending',
  
  FOREIGN KEY (user_id) REFERENCES user_profile(user_id)
);

-- Detailed Activity Results
CREATE TABLE activity_results (
  id TEXT PRIMARY KEY,
  session_id TEXT,                  -- Links to activity_sessions
  user_id TEXT,
  
  -- Question/Item Details
  item_type TEXT,                   -- 'flashcard', 'scenario', 'breathing_cycle'
  item_content TEXT,                -- What was shown/asked
  item_difficulty INTEGER,          -- 1-5 difficulty of this item
  
  -- User Response
  user_response TEXT,               -- User's answer/choice
  response_time_ms INTEGER,         -- Response time in milliseconds
  correct BOOLEAN,                  -- Was response correct
  confidence_level INTEGER,         -- User's confidence (1-5)
  
  -- Learning Insights
  mistake_type TEXT,                -- Type of error if incorrect
  learning_opportunity TEXT,        -- What this teaches us
  
  -- Sync Metadata
  completed_at DATETIME,
  device_id TEXT,
  synced_at DATETIME,
  sync_status TEXT DEFAULT 'pending',
  
  FOREIGN KEY (session_id) REFERENCES activity_sessions(id),
  FOREIGN KEY (user_id) REFERENCES user_profile(user_id)
);

-- Sync Operation Tracking
CREATE TABLE sync_log (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  device_id TEXT,
  
  -- Sync Operation Details
  operation_type TEXT,              -- 'pull', 'push', 'conflict_resolution'
  table_name TEXT,                  -- Which table was synced
  record_count INTEGER,             -- How many records
  
  -- Timing & Status
  started_at DATETIME,
  completed_at DATETIME,
  status TEXT,                      -- 'success', 'failed', 'partial'
  error_details TEXT,               -- Error information if failed
  
  -- Performance Metrics
  data_size_kb INTEGER,             -- Size of data transferred
  network_type TEXT,                -- 'wifi', 'cellular'
  
  created_at DATETIME
);
```

### **Layer 2: AsyncStorage (Quick Access)**

**Purpose**: Immediate access data, user preferences, app state

```typescript
// Type-safe AsyncStorage keys and data structures

interface AsyncStorageKeys {
  // Authentication & Account
  USER_ID: string;                  // Current user identifier
  AUTH_TOKEN: string;               // Authentication token
  DEVICE_ID: string;                // Unique device identifier
  BIOMETRIC_ENABLED: boolean;       // Biometric auth preference
  
  // Sync Configuration
  SYNC_ENABLED: boolean;            // User preference for cloud sync
  LAST_SYNC_TIMESTAMP: string;      // ISO timestamp of last sync
  OFFLINE_CHANGES_COUNT: number;    // Number of unsynced changes
  SYNC_RETRY_COUNT: number;         // Failed sync attempt counter
  
  // User Preferences (Synced to Cloud)
  ACCESSIBILITY_SETTINGS: AccessibilitySettings;
  THEME_PREFERENCES: ThemePreferences;
  AVATAR_CONFIG: AvatarConfig;
  NOTIFICATION_SETTINGS: NotificationSettings;
  
  // App State
  ONBOARDING_COMPLETED: boolean;
  CURRENT_SESSION: SessionState;
  SELECTED_GOALS: string[];         // User's therapeutic goals
  
  // Quick Access Data
  RECENT_ACTIVITIES: string[];      // Recently completed activities
  SUGGESTED_ACTIVITIES: string[];   // AI-suggested next activities
  CURRENT_STREAK: number;           // Current daily streak
  LAST_ACTIVITY_DATE: string;       // ISO date of last activity
  
  // Cache for Performance
  CACHED_PROGRESS: ProgressSummary; // Latest progress data
  CACHED_ACHIEVEMENTS: Achievement[]; // Recent achievements
}

interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  highContrast: boolean;
  reducedMotion: boolean;
  voiceEnabled: boolean;
  hapticFeedback: boolean;
  screenReaderEnabled: boolean;
  visualIndicators: boolean;
  audioDescriptions: boolean;
}

interface ThemePreferences {
  primaryColor: string;             // Hex color
  darkMode: boolean;
  customColors: boolean;
  animations: 'full' | 'reduced' | 'none';
}

interface AvatarConfig {
  bodyType: 'robot' | 'animal' | 'person';
  primaryColor: string;
  accessories: string[];
  name: string;
  expressions: string[];
  customizations: Record<string, any>;
}

interface SessionState {
  lastActiveScreen: string;
  botGreetingShown: boolean;
  dailyCheckInCompleted: boolean;
  currentActivity?: string;
  sessionStartTime: string;
}
```

### **Layer 3: Cloud Storage (Backup & Sync)**

**Purpose**: Multi-device synchronization, data backup, family features

```sql
-- Cloud Database Schema (PostgreSQL)

-- User Account Management
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Account Details
  display_name VARCHAR(100),
  age_group VARCHAR(10),           -- '6-12', '13-18', '19-24'
  guardian_email VARCHAR(255),     -- Required for users under 13
  
  -- Subscription & Features
  subscription_type VARCHAR(20) DEFAULT 'free',
  premium_features JSONB DEFAULT '{}',
  
  -- Privacy & Compliance
  parental_consent BOOLEAN DEFAULT false,
  consent_date TIMESTAMP,
  data_retention_days INTEGER DEFAULT 365,
  privacy_level VARCHAR(20) DEFAULT 'standard',
  
  -- Account Status
  active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  
  CONSTRAINT valid_age_group CHECK (age_group IN ('6-12', '13-18', '19-24'))
);

-- Device Registration & Management
CREATE TABLE user_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Device Information
  device_id VARCHAR(255) UNIQUE NOT NULL,
  device_name VARCHAR(100),
  platform VARCHAR(20),           -- 'ios', 'android'
  app_version VARCHAR(20),
  os_version VARCHAR(50),
  
  -- Registration Details
  registered_at TIMESTAMP DEFAULT NOW(),
  last_sync TIMESTAMP,
  sync_frequency VARCHAR(20) DEFAULT 'auto',
  
  -- Device Status
  active BOOLEAN DEFAULT true,
  trusted BOOLEAN DEFAULT false,   -- Parent-approved device
  
  -- Performance Metrics
  total_syncs INTEGER DEFAULT 0,
  failed_syncs INTEGER DEFAULT 0,
  average_sync_time INTEGER,       -- Seconds
  
  CONSTRAINT valid_platform CHECK (platform IN ('ios', 'android'))
);

-- Replicated Local Tables (Cloud Versions)
-- These mirror the local SQLite structure with additional cloud metadata

CREATE TABLE activity_sessions_cloud (
  -- All fields from local table plus:
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  device_id VARCHAR(255) REFERENCES user_devices(device_id),
  
  -- ... all local fields ...
  
  -- Cloud-specific metadata
  cloud_created_at TIMESTAMP DEFAULT NOW(),
  last_modified_device VARCHAR(255),
  data_hash VARCHAR(64),           -- For integrity verification
  conflict_resolution_applied BOOLEAN DEFAULT false,
  conflict_resolution_details JSONB
);

CREATE TABLE skill_progress_cloud (
  -- Similar structure with cloud metadata
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  -- ... all local fields ...
  cloud_created_at TIMESTAMP DEFAULT NOW(),
  aggregate_data JSONB,            -- Cross-device aggregated insights
  ai_insights JSONB                -- AI-generated progress insights
);

CREATE TABLE chat_messages_cloud (
  -- Encrypted message storage
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  
  -- Encrypted content
  encrypted_message_data BYTEA,    -- Encrypted message content
  encryption_key_id VARCHAR(64),   -- Key identifier for decryption
  
  -- Metadata (non-encrypted)
  message_timestamp TIMESTAMP,
  message_type VARCHAR(20),
  conversation_session_id UUID,
  
  -- Cloud metadata
  cloud_created_at TIMESTAMP DEFAULT NOW(),
  device_id VARCHAR(255)
);

-- Family & Guardian Features
CREATE TABLE guardian_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guardian_email VARCHAR(255),
  user_id UUID REFERENCES users(id),
  
  -- Relationship Details
  relationship_type VARCHAR(20),   -- 'parent', 'caregiver', 'therapist'
  access_level VARCHAR(20),        -- 'full', 'progress_only', 'emergency'
  
  -- Consent & Approval
  consent_given BOOLEAN DEFAULT false,
  consent_date TIMESTAMP,
  approved_by_user BOOLEAN DEFAULT false,
  
  -- Access Controls
  can_view_progress BOOLEAN DEFAULT true,
  can_view_activities BOOLEAN DEFAULT true,
  can_view_chat_summary BOOLEAN DEFAULT false,
  can_export_data BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP DEFAULT NOW(),
  active BOOLEAN DEFAULT true
);

-- Sync Operations & Monitoring
CREATE TABLE sync_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  device_id VARCHAR(255),
  
  -- Operation Details
  operation_type VARCHAR(20),      -- 'push', 'pull', 'conflict_resolve'
  table_name VARCHAR(50),
  record_count INTEGER,
  data_size_bytes BIGINT,
  
  -- Timing & Performance
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  duration_ms INTEGER,
  
  -- Status & Results
  status VARCHAR(20),              -- 'pending', 'success', 'failed', 'partial'
  error_code VARCHAR(50),
  error_message TEXT,
  records_processed INTEGER,
  conflicts_detected INTEGER,
  conflicts_resolved INTEGER
);
```

---

## 🔄 **Synchronization Strategy**

### **Sync Triggers**
1. **App Foreground**: Automatic sync when app becomes active
2. **Activity Completion**: Immediate sync of new activity data
3. **Settings Change**: Sync user preferences and avatar changes
4. **Periodic**: Background sync every 15 minutes when online
5. **Manual**: User-initiated sync from settings

### **Conflict Resolution**
```typescript
class ConflictResolver {
  
  async resolveConflicts(conflicts: DataConflict[]): Promise<Resolution[]> {
    const resolutions = [];
    
    for (const conflict of conflicts) {
      const resolution = await this.getResolutionStrategy(conflict);
      
      switch (conflict.table) {
        case 'activity_sessions':
          // Always keep all activity sessions (no true conflicts)
          resolutions.push(await this.mergeActivitySessions(conflict));
          break;
          
        case 'skill_progress':
          // Use highest progress values, combine session counts
          resolutions.push(await this.mergeProgressData(conflict));
          break;
          
        case 'user_profile':
          // Prefer most recent updates, merge non-conflicting fields
          resolutions.push(await this.mergeUserProfile(conflict));
          break;
          
        case 'chat_messages':
          // Keep all messages, resolve by timestamp
          resolutions.push(await this.mergeChatHistory(conflict));
          break;
          
        default:
          // Default: use most recent timestamp
          resolutions.push(await this.useLatestTimestamp(conflict));
      }
    }
    
    return resolutions;
  }
  
  private async mergeProgressData(conflict: DataConflict): Promise<Resolution> {
    const localData = conflict.localRecord;
    const cloudData = conflict.cloudRecord;
    
    // Merge strategy for skill progress
    const mergedData = {
      ...localData,
      current_level: Math.max(localData.current_level, cloudData.current_level),
      progress_percentage: Math.max(localData.progress_percentage, cloudData.progress_percentage),
      sessions_completed: localData.sessions_completed + cloudData.sessions_completed,
      milestones_reached: this.mergeMilestones(localData.milestones_reached, cloudData.milestones_reached),
      last_updated: new Date().toISOString()
    };
    
    return {
      type: 'merge',
      resolvedRecord: mergedData,
      reason: 'Combined progress from multiple devices'
    };
  }
}
```

### **Privacy & Encryption**

```typescript
class EncryptionService {
  
  // Encrypt sensitive data before cloud sync
  async encryptForCloud(data: SensitiveData): Promise<EncryptedData> {
    const encryptionKey = await this.getUserEncryptionKey();
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipher('aes-256-gcm', encryptionKey, iv);
    const encrypted = Buffer.concat([
      cipher.update(JSON.stringify(data), 'utf8'),
      cipher.final()
    ]);
    
    return {
      encryptedData: encrypted.toString('base64'),
      iv: iv.toString('base64'),
      authTag: cipher.getAuthTag().toString('base64'),
      keyId: await this.getKeyId()
    };
  }
  
  // Data classification for privacy
  classifyData(tableName: string, data: any): PrivacyLevel {
    const classifications = {
      'user_profile': 'personal',
      'activity_sessions': 'personal', 
      'chat_messages': 'sensitive',
      'achievement': 'personal',
      'skill_progress': 'personal'
    };
    
    return classifications[tableName] || 'public';
  }
}
```

This comprehensive storage architecture ensures BuddyBot provides a reliable, secure, and autism-friendly experience while supporting modern multi-device usage patterns. 