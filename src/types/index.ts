/**
 * BuddyBot TypeScript Definitions
 * Comprehensive type definitions for autism support app data models
 */

// =============================================================================
// CORE USER TYPES
// =============================================================================

export interface UserProfile {
  id: string;                    // UUID
  userId: string;                // Cloud account identifier
  displayName: string;           // User's chosen name
  ageGroup: AgeGroup;            // Age category for content filtering
  guardianEmail?: string;        // Required for minors (COPPA)
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
  syncedAt?: string;             // Last sync timestamp
  syncStatus: SyncStatus;        // Sync state
  
  // Profile Configuration
  avatarConfig: AvatarConfig;
  accessibilityPreferences: AccessibilitySettings;
  selectedGoals: TherapeuticGoal[];
  privacySettings: PrivacySettings;
}

export type AgeGroup = '6-12' | '13-18' | '19-24';

export type SyncStatus = 'synced' | 'pending' | 'conflict' | 'error';

export type TherapeuticGoal = 
  | 'social_skills' 
  | 'emotion_recognition' 
  | 'communication' 
  | 'self_regulation'
  | 'coping_strategies';

// =============================================================================
// AVATAR & CUSTOMIZATION
// =============================================================================

export interface AvatarConfig {
  bodyType: 'robot' | 'animal' | 'person';
  primaryColor: string;          // Hex color
  accessories: string[];         // Array of accessory IDs
  name: string;                  // Avatar name
  expressions: string[];         // Available expressions
  customizations: Record<string, any>; // Additional customizations
}

// =============================================================================
// ACCESSIBILITY & PREFERENCES
// =============================================================================

export interface AccessibilitySettings {
  fontSize: FontSize;
  highContrast: boolean;
  reducedMotion: boolean;
  voiceEnabled: boolean;
  hapticFeedback: boolean;
  screenReaderEnabled: boolean;
  visualIndicators: boolean;
  audioDescriptions: boolean;
  simplifiedLanguage: boolean;   // For younger users
  largerTouchTargets: boolean;   // Extra large buttons
}

export type FontSize = 'small' | 'medium' | 'large' | 'extra-large';

export interface ThemePreferences {
  primaryColor: string;
  darkMode: boolean;
  customColors: boolean;
  animations: AnimationLevel;
}

export type AnimationLevel = 'full' | 'reduced' | 'none';

export interface PrivacySettings {
  shareProgressWithGuardian: boolean;
  allowDataExport: boolean;
  enableCloudSync: boolean;
  dataRetentionDays: number;
}

// =============================================================================
// ACTIVITY & SESSION DATA
// =============================================================================

export interface ActivitySession {
  id: string;
  userId: string;
  activityType: ActivityType;
  activitySubtype?: string;      // Specific variant
  startedAt: string;             // ISO timestamp
  completedAt?: string;          // ISO timestamp
  durationSeconds?: number;
  
  // Performance Metrics
  score?: number;                // Activity-specific score (0-100)
  accuracyPercentage?: number;   // Correctness percentage
  difficultyLevel: DifficultyLevel; // 1-5 scale
  
  // Emotional Context
  moodBefore?: MoodState;
  moodAfter?: MoodState;
  stressLevelBefore?: number;    // 1-10 scale
  stressLevelAfter?: number;     // 1-10 scale
  
  // Technical Metadata
  deviceId: string;
  appVersion: string;
  createdAt: string;
  updatedAt: string;
  syncedAt?: string;
  syncStatus: SyncStatus;
}

export type ActivityType = 
  | 'social_flashcards'
  | 'emotion_recognition'
  | 'breathing_exercise'
  | 'role_play_scenario'
  | 'communication_practice'
  | 'self_regulation_tools'
  | 'daily_check_in'
  | 'mindfulness_activity';

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export type MoodState = 
  | 'very_happy' | 'happy' | 'okay' | 'sad' | 'very_sad'
  | 'excited' | 'calm' | 'nervous' | 'angry' | 'frustrated'
  | 'confused' | 'proud' | 'disappointed' | 'grateful';

// =============================================================================
// SKILL PROGRESS TRACKING
// =============================================================================

export interface SkillProgress {
  id: string;
  userId: string;
  skillCategory: SkillCategory;
  skillSubcategory?: string;
  
  // Progress Metrics
  currentLevel: number;          // 1-10 proficiency
  progressPercentage: number;    // 0-100
  sessionsCompleted: number;     // Total sessions
  
  // Milestones & Achievements
  milestonesReached: string[];   // Array of milestone IDs
  lastMilestoneDate?: string;    // ISO timestamp
  nextMilestoneTarget?: string;  // Next milestone description
  
  // Assessment Data
  assessmentResults: AssessmentResult[];
  strengths: string[];           // Identified strengths
  areasForGrowth: string[];      // Areas needing focus
  
  // Metadata
  lastUpdated: string;
  deviceId: string;
  createdAt: string;
  updatedAt: string;
  syncedAt?: string;
  syncStatus: SyncStatus;
}

export type SkillCategory = 
  | 'social_skills'
  | 'emotional_awareness'
  | 'communication'
  | 'self_regulation'
  | 'coping_strategies'
  | 'independence'
  | 'sensory_management';

export interface AssessmentResult {
  assessmentId: string;
  date: string;
  score: number;
  maxScore: number;
  areas: Record<string, number>; // Sub-skill scores
  notes?: string;
}

// =============================================================================
// CHAT & CONVERSATION DATA
// =============================================================================

export interface ChatMessage {
  id: string;
  userId: string;
  conversationSessionId: string; // Group related messages
  
  // Message Content
  messageText: string;           // Plain text or encrypted
  messageType: MessageType;
  isBotMessage: boolean;
  
  // Context & Metadata
  timestamp: string;             // ISO timestamp
  moodContext?: MoodState;       // User's mood during conversation
  activityContext?: string;      // Related activity if applicable
  intentCategory?: IntentCategory;
  
  // Therapeutic Value
  therapeuticGoal?: TherapeuticGoal;
  interventionType?: InterventionType;
  effectivenessRating?: number;  // 1-5 how helpful
  
  // Technical Metadata
  deviceId: string;
  createdAt: string;
  syncedAt?: string;
  syncStatus: SyncStatus;
}

export type MessageType = 'user' | 'bot' | 'system' | 'suggestion';

export type IntentCategory = 
  | 'support' | 'instruction' | 'celebration' | 'check_in' 
  | 'guidance' | 'encouragement' | 'clarification';

export type InterventionType = 
  | 'cognitive_behavioral' | 'social_skills_training' | 'mindfulness'
  | 'emotional_regulation' | 'positive_reinforcement' | 'redirection';

// =============================================================================
// ACHIEVEMENTS & GAMIFICATION
// =============================================================================

export interface Achievement {
  id: string;
  userId: string;
  
  // Achievement Details
  achievementType: AchievementType;
  badgeCategory: BadgeCategory;
  badgeName: string;
  badgeIcon: string;             // Icon identifier
  description: string;
  
  // Achievement Context
  earnedAt: string;              // ISO timestamp
  activityTrigger?: string;      // What activity earned this
  skillRelated?: SkillCategory;  // Which skill area
  
  // Motivational Data
  celebrationShown: boolean;     // Was achievement celebrated
  sharedWithGuardian: boolean;   // Shared with parent/caregiver
  
  // Metadata
  deviceId: string;
  createdAt: string;
  syncedAt?: string;
  syncStatus: SyncStatus;
}

export type AchievementType = 
  | 'participation' | 'progress' | 'consistency' | 'milestone' 
  | 'improvement' | 'creativity' | 'helping_others';

export type BadgeCategory = 
  | 'first_time' | 'streak' | 'mastery' | 'social' 
  | 'emotional' | 'communication' | 'self_care';

// =============================================================================
// DETAILED ACTIVITY RESULTS
// =============================================================================

export interface ActivityResult {
  id: string;
  sessionId: string;             // Links to ActivitySession
  userId: string;
  
  // Question/Item Details
  itemType: string;              // 'flashcard', 'scenario', 'breathing_cycle'
  itemContent: string;           // What was shown/asked
  itemDifficulty: DifficultyLevel;
  
  // User Response
  userResponse: string;          // User's answer/choice
  responseTimeMs: number;        // Response time in milliseconds
  correct: boolean;              // Was response correct
  confidenceLevel?: number;      // User's confidence (1-5)
  
  // Learning Insights
  mistakeType?: string;          // Type of error if incorrect
  learningOpportunity?: string;  // What this teaches us
  
  // Metadata
  completedAt: string;
  deviceId: string;
  syncedAt?: string;
  syncStatus: SyncStatus;
}

// =============================================================================
// ASYNC STORAGE TYPES
// =============================================================================

export interface SessionState {
  lastActiveScreen: string;
  botGreetingShown: boolean;
  dailyCheckInCompleted: boolean;
  currentActivity?: string;
  sessionStartTime: string;
  currentStreak: number;
  lastActivityDate?: string;
}

export interface ProgressSummary {
  overallProgress: number;       // 0-100 percentage
  skillProgressSummary: Record<SkillCategory, number>;
  recentAchievements: Achievement[];
  currentStreaks: Record<string, number>;
  nextMilestone?: string;
}

// =============================================================================
// SYNC & CLOUD TYPES
// =============================================================================

export interface SyncOperation {
  id: string;
  userId: string;
  deviceId: string;
  
  // Operation Details
  operationType: SyncOperationType;
  tableName: string;
  recordCount: number;
  dataSizeBytes?: number;
  
  // Timing & Performance
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  
  // Status & Results
  status: SyncOperationStatus;
  errorCode?: string;
  errorMessage?: string;
  recordsProcessed?: number;
  conflictsDetected?: number;
  conflictsResolved?: number;
}

export type SyncOperationType = 'push' | 'pull' | 'conflict_resolve';

export type SyncOperationStatus = 'pending' | 'in_progress' | 'success' | 'failed' | 'partial';

export interface DataConflict {
  id: string;
  tableName: string;
  recordId: string;
  conflictType: ConflictType;
  localRecord: any;
  cloudRecord: any;
  localTimestamp: string;
  cloudTimestamp: string;
}

export type ConflictType = 'update_conflict' | 'delete_conflict' | 'field_mismatch';

// =============================================================================
// ERROR HANDLING & VALIDATION
// =============================================================================

export interface AppError {
  id: string;
  timestamp: string;
  errorType: ErrorType;
  errorCode: string;
  message: string;
  context?: Record<string, any>;
  userId?: string;
  deviceId: string;
  resolved: boolean;
}

export type ErrorType = 
  | 'network' | 'storage' | 'validation' | 'sync' 
  | 'authentication' | 'permission' | 'unknown';

// =============================================================================
// API & NETWORK TYPES
// =============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  tokenType: string;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

export interface DatabaseTable {
  name: string;
  version: number;
  schema: string;
  indices?: string[];
}

export interface ValidationRule {
  field: string;
  required: boolean;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: any) => boolean;
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>; 