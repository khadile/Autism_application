/**
 * BuddyBot AsyncStorage Service
 * Type-safe wrapper for AsyncStorage with autism-specific data handling
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  AccessibilitySettings, 
  ThemePreferences, 
  AvatarConfig, 
  SessionState, 
  ProgressSummary,
  Achievement,
  SyncStatus 
} from '../types';

// =============================================================================
// STORAGE KEYS & INTERFACES
// =============================================================================

export const STORAGE_KEYS = {
  // Authentication & Account
  USER_ID: 'user_id',
  AUTH_TOKEN: 'auth_token',
  DEVICE_ID: 'device_id',
  BIOMETRIC_ENABLED: 'biometric_enabled',
  
  // Sync Configuration
  SYNC_ENABLED: 'sync_enabled',
  LAST_SYNC_TIMESTAMP: 'last_sync_timestamp',
  OFFLINE_CHANGES_COUNT: 'offline_changes_count',
  SYNC_RETRY_COUNT: 'sync_retry_count',
  
  // User Preferences (Synced to Cloud)
  ACCESSIBILITY_SETTINGS: 'accessibility_settings',
  THEME_PREFERENCES: 'theme_preferences',
  AVATAR_CONFIG: 'avatar_config',
  NOTIFICATION_SETTINGS: 'notification_settings',
  
  // App State
  ONBOARDING_COMPLETED: 'onboarding_completed',
  CURRENT_SESSION: 'current_session',
  SELECTED_GOALS: 'selected_goals',
  
  // Quick Access Data
  RECENT_ACTIVITIES: 'recent_activities',
  SUGGESTED_ACTIVITIES: 'suggested_activities',
  CURRENT_STREAK: 'current_streak',
  LAST_ACTIVITY_DATE: 'last_activity_date',
  
  // Cache for Performance
  CACHED_PROGRESS: 'cached_progress',
  CACHED_ACHIEVEMENTS: 'cached_achievements',
  
  // App Configuration
  APP_VERSION: 'app_version',
  FIRST_LAUNCH: 'first_launch',
  PRIVACY_POLICY_ACCEPTED: 'privacy_policy_accepted'
} as const;

interface NotificationSettings {
  enablePushNotifications: boolean;
  dailyReminders: boolean;
  achievementNotifications: boolean;
  progressUpdates: boolean;
  quietHours: {
    enabled: boolean;
    startTime: string; // HH:MM format
    endTime: string;   // HH:MM format
  };
}

// =============================================================================
// ASYNC STORAGE SERVICE CLASS
// =============================================================================

export class AsyncStorageService {
  private static instance: AsyncStorageService;

  private constructor() {}

  public static getInstance(): AsyncStorageService {
    if (!AsyncStorageService.instance) {
      AsyncStorageService.instance = new AsyncStorageService();
    }
    return AsyncStorageService.instance;
  }

  // =============================================================================
  // GENERIC STORAGE METHODS
  // =============================================================================

  private async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Failed to set AsyncStorage item ${key}:`, error);
      throw error;
    }
  }

  private async getItem<T>(key: string, defaultValue?: T): Promise<T | null> {
    try {
      const serializedValue = await AsyncStorage.getItem(key);
      if (serializedValue === null) {
        return defaultValue || null;
      }
      return JSON.parse(serializedValue) as T;
    } catch (error) {
      console.error(`Failed to get AsyncStorage item ${key}:`, error);
      return defaultValue || null;
    }
  }

  private async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove AsyncStorage item ${key}:`, error);
      throw error;
    }
  }

  // =============================================================================
  // AUTHENTICATION & ACCOUNT
  // =============================================================================

  async setUserId(userId: string): Promise<void> {
    await this.setItem(STORAGE_KEYS.USER_ID, userId);
  }

  async getUserId(): Promise<string | null> {
    return await this.getItem<string>(STORAGE_KEYS.USER_ID);
  }

  async setAuthToken(token: string): Promise<void> {
    await this.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  async getAuthToken(): Promise<string | null> {
    return await this.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
  }

  async setDeviceId(deviceId: string): Promise<void> {
    await this.setItem(STORAGE_KEYS.DEVICE_ID, deviceId);
  }

  async getDeviceId(): Promise<string | null> {
    return await this.getItem<string>(STORAGE_KEYS.DEVICE_ID);
  }

  async setBiometricEnabled(enabled: boolean): Promise<void> {
    await this.setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, enabled);
  }

  async getBiometricEnabled(): Promise<boolean> {
    return await this.getItem<boolean>(STORAGE_KEYS.BIOMETRIC_ENABLED, false);
  }

  // =============================================================================
  // SYNC CONFIGURATION
  // =============================================================================

  async setSyncEnabled(enabled: boolean): Promise<void> {
    await this.setItem(STORAGE_KEYS.SYNC_ENABLED, enabled);
  }

  async getSyncEnabled(): Promise<boolean> {
    return await this.getItem<boolean>(STORAGE_KEYS.SYNC_ENABLED, true);
  }

  async setLastSyncTimestamp(timestamp: string): Promise<void> {
    await this.setItem(STORAGE_KEYS.LAST_SYNC_TIMESTAMP, timestamp);
  }

  async getLastSyncTimestamp(): Promise<string | null> {
    return await this.getItem<string>(STORAGE_KEYS.LAST_SYNC_TIMESTAMP);
  }

  async incrementOfflineChanges(): Promise<number> {
    const current = await this.getItem<number>(STORAGE_KEYS.OFFLINE_CHANGES_COUNT, 0);
    const newCount = current + 1;
    await this.setItem(STORAGE_KEYS.OFFLINE_CHANGES_COUNT, newCount);
    return newCount;
  }

  async resetOfflineChanges(): Promise<void> {
    await this.setItem(STORAGE_KEYS.OFFLINE_CHANGES_COUNT, 0);
  }

  async getOfflineChangesCount(): Promise<number> {
    return await this.getItem<number>(STORAGE_KEYS.OFFLINE_CHANGES_COUNT, 0);
  }

  // =============================================================================
  // USER PREFERENCES
  // =============================================================================

  async setAccessibilitySettings(settings: AccessibilitySettings): Promise<void> {
    await this.setItem(STORAGE_KEYS.ACCESSIBILITY_SETTINGS, settings);
    await this.incrementOfflineChanges(); // Mark for sync
  }

  async getAccessibilitySettings(): Promise<AccessibilitySettings | null> {
    return await this.getItem<AccessibilitySettings>(STORAGE_KEYS.ACCESSIBILITY_SETTINGS);
  }

  async getDefaultAccessibilitySettings(): Promise<AccessibilitySettings> {
    return {
      fontSize: 'medium',
      highContrast: false,
      reducedMotion: false,
      voiceEnabled: true,
      hapticFeedback: true,
      screenReaderEnabled: false,
      visualIndicators: true,
      audioDescriptions: false,
      simplifiedLanguage: false,
      largerTouchTargets: false
    };
  }

  async setThemePreferences(preferences: ThemePreferences): Promise<void> {
    await this.setItem(STORAGE_KEYS.THEME_PREFERENCES, preferences);
    await this.incrementOfflineChanges();
  }

  async getThemePreferences(): Promise<ThemePreferences | null> {
    return await this.getItem<ThemePreferences>(STORAGE_KEYS.THEME_PREFERENCES);
  }

  async getDefaultThemePreferences(): Promise<ThemePreferences> {
    return {
      primaryColor: '#87CEEB',
      darkMode: false,
      customColors: false,
      animations: 'full'
    };
  }

  async setAvatarConfig(config: AvatarConfig): Promise<void> {
    await this.setItem(STORAGE_KEYS.AVATAR_CONFIG, config);
    await this.incrementOfflineChanges();
  }

  async getAvatarConfig(): Promise<AvatarConfig | null> {
    return await this.getItem<AvatarConfig>(STORAGE_KEYS.AVATAR_CONFIG);
  }

  async getDefaultAvatarConfig(): Promise<AvatarConfig> {
    return {
      bodyType: 'robot',
      primaryColor: '#87CEEB',
      accessories: [],
      name: 'Buddy',
      expressions: ['happy', 'encouraging'],
      customizations: {}
    };
  }

  async setNotificationSettings(settings: NotificationSettings): Promise<void> {
    await this.setItem(STORAGE_KEYS.NOTIFICATION_SETTINGS, settings);
  }

  async getNotificationSettings(): Promise<NotificationSettings | null> {
    return await this.getItem<NotificationSettings>(STORAGE_KEYS.NOTIFICATION_SETTINGS);
  }

  async getDefaultNotificationSettings(): Promise<NotificationSettings> {
    return {
      enablePushNotifications: true,
      dailyReminders: true,
      achievementNotifications: true,
      progressUpdates: true,
      quietHours: {
        enabled: false,
        startTime: '22:00',
        endTime: '07:00'
      }
    };
  }

  // =============================================================================
  // APP STATE
  // =============================================================================

  async setOnboardingCompleted(completed: boolean): Promise<void> {
    await this.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, completed);
  }

  async getOnboardingCompleted(): Promise<boolean> {
    return await this.getItem<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETED, false);
  }

  async setCurrentSession(session: SessionState): Promise<void> {
    await this.setItem(STORAGE_KEYS.CURRENT_SESSION, session);
  }

  async getCurrentSession(): Promise<SessionState | null> {
    return await this.getItem<SessionState>(STORAGE_KEYS.CURRENT_SESSION);
  }

  async getDefaultSessionState(): Promise<SessionState> {
    return {
      lastActiveScreen: 'home',
      botGreetingShown: false,
      dailyCheckInCompleted: false,
      sessionStartTime: new Date().toISOString(),
      currentStreak: 0
    };
  }

  async setSelectedGoals(goals: string[]): Promise<void> {
    await this.setItem(STORAGE_KEYS.SELECTED_GOALS, goals);
    await this.incrementOfflineChanges();
  }

  async getSelectedGoals(): Promise<string[]> {
    return await this.getItem<string[]>(STORAGE_KEYS.SELECTED_GOALS, []);
  }

  // =============================================================================
  // QUICK ACCESS DATA
  // =============================================================================

  async setRecentActivities(activities: string[]): Promise<void> {
    // Keep only last 10 activities
    const recentActivities = activities.slice(-10);
    await this.setItem(STORAGE_KEYS.RECENT_ACTIVITIES, recentActivities);
  }

  async getRecentActivities(): Promise<string[]> {
    return await this.getItem<string[]>(STORAGE_KEYS.RECENT_ACTIVITIES, []);
  }

  async addRecentActivity(activityType: string): Promise<void> {
    const current = await this.getRecentActivities();
    const updated = [...current.filter(a => a !== activityType), activityType];
    await this.setRecentActivities(updated);
  }

  async setSuggestedActivities(activities: string[]): Promise<void> {
    await this.setItem(STORAGE_KEYS.SUGGESTED_ACTIVITIES, activities);
  }

  async getSuggestedActivities(): Promise<string[]> {
    return await this.getItem<string[]>(STORAGE_KEYS.SUGGESTED_ACTIVITIES, []);
  }

  async setCurrentStreak(streak: number): Promise<void> {
    await this.setItem(STORAGE_KEYS.CURRENT_STREAK, streak);
  }

  async getCurrentStreak(): Promise<number> {
    return await this.getItem<number>(STORAGE_KEYS.CURRENT_STREAK, 0);
  }

  async incrementStreak(): Promise<number> {
    const current = await this.getCurrentStreak();
    const newStreak = current + 1;
    await this.setCurrentStreak(newStreak);
    return newStreak;
  }

  async resetStreak(): Promise<void> {
    await this.setCurrentStreak(0);
  }

  async setLastActivityDate(date: string): Promise<void> {
    await this.setItem(STORAGE_KEYS.LAST_ACTIVITY_DATE, date);
  }

  async getLastActivityDate(): Promise<string | null> {
    return await this.getItem<string>(STORAGE_KEYS.LAST_ACTIVITY_DATE);
  }

  // =============================================================================
  // CACHE FOR PERFORMANCE
  // =============================================================================

  async setCachedProgress(progress: ProgressSummary): Promise<void> {
    await this.setItem(STORAGE_KEYS.CACHED_PROGRESS, progress);
  }

  async getCachedProgress(): Promise<ProgressSummary | null> {
    return await this.getItem<ProgressSummary>(STORAGE_KEYS.CACHED_PROGRESS);
  }

  async setCachedAchievements(achievements: Achievement[]): Promise<void> {
    await this.setItem(STORAGE_KEYS.CACHED_ACHIEVEMENTS, achievements);
  }

  async getCachedAchievements(): Promise<Achievement[]> {
    return await this.getItem<Achievement[]>(STORAGE_KEYS.CACHED_ACHIEVEMENTS, []);
  }

  // =============================================================================
  // APP CONFIGURATION
  // =============================================================================

  async setAppVersion(version: string): Promise<void> {
    await this.setItem(STORAGE_KEYS.APP_VERSION, version);
  }

  async getAppVersion(): Promise<string | null> {
    return await this.getItem<string>(STORAGE_KEYS.APP_VERSION);
  }

  async setFirstLaunch(isFirst: boolean): Promise<void> {
    await this.setItem(STORAGE_KEYS.FIRST_LAUNCH, isFirst);
  }

  async isFirstLaunch(): Promise<boolean> {
    return await this.getItem<boolean>(STORAGE_KEYS.FIRST_LAUNCH, true);
  }

  async setPrivacyPolicyAccepted(accepted: boolean): Promise<void> {
    await this.setItem(STORAGE_KEYS.PRIVACY_POLICY_ACCEPTED, accepted);
  }

  async getPrivacyPolicyAccepted(): Promise<boolean> {
    return await this.getItem<boolean>(STORAGE_KEYS.PRIVACY_POLICY_ACCEPTED, false);
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  async getAllStoredData(): Promise<Record<string, any>> {
    const allData: Record<string, any> = {};
    
    for (const [keyName, keyValue] of Object.entries(STORAGE_KEYS)) {
      try {
        const data = await this.getItem(keyValue);
        allData[keyName] = data;
      } catch (error) {
        console.error(`Failed to get data for key ${keyValue}:`, error);
        allData[keyName] = null;
      }
    }
    
    return allData;
  }

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.clear();
      console.log('All AsyncStorage data cleared');
    } catch (error) {
      console.error('Failed to clear AsyncStorage:', error);
      throw error;
    }
  }

  async clearUserData(): Promise<void> {
    const keysToKeep = [
      STORAGE_KEYS.DEVICE_ID,
      STORAGE_KEYS.APP_VERSION,
      STORAGE_KEYS.FIRST_LAUNCH
    ];
    
    for (const [, keyValue] of Object.entries(STORAGE_KEYS)) {
      if (!keysToKeep.includes(keyValue)) {
        await this.removeItem(keyValue);
      }
    }
    
    console.log('User data cleared, device data preserved');
  }

  async exportUserData(): Promise<Record<string, any>> {
    const sensitiveKeys = [STORAGE_KEYS.AUTH_TOKEN];
    const exportData: Record<string, any> = {};
    
    for (const [keyName, keyValue] of Object.entries(STORAGE_KEYS)) {
      if (!sensitiveKeys.includes(keyValue)) {
        try {
          const data = await this.getItem(keyValue);
          if (data !== null) {
            exportData[keyName] = data;
          }
        } catch (error) {
          console.error(`Failed to export data for key ${keyValue}:`, error);
        }
      }
    }
    
    return exportData;
  }

  async getStorageSize(): Promise<number> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      let totalSize = 0;
      
      for (const key of allKeys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += value.length;
        }
      }
      
      return totalSize; // Size in characters (approximate bytes)
    } catch (error) {
      console.error('Failed to calculate storage size:', error);
      return 0;
    }
  }

  // =============================================================================
  // AUTISM-SPECIFIC UTILITIES
  // =============================================================================

  async updateAccessibilityForAge(ageGroup: string): Promise<void> {
    const currentSettings = await this.getAccessibilitySettings() || await this.getDefaultAccessibilitySettings();
    
    // Adjust settings based on age group
    switch (ageGroup) {
      case '6-12':
        currentSettings.simplifiedLanguage = true;
        currentSettings.largerTouchTargets = true;
        currentSettings.visualIndicators = true;
        break;
      case '13-18':
        currentSettings.simplifiedLanguage = false;
        currentSettings.largerTouchTargets = false;
        break;
      case '19-24':
        // Use user's current preferences
        break;
    }
    
    await this.setAccessibilitySettings(currentSettings);
  }

  async shouldShowBotGreeting(): Promise<boolean> {
    const session = await this.getCurrentSession();
    return !session?.botGreetingShown;
  }

  async markBotGreetingShown(): Promise<void> {
    const session = await this.getCurrentSession() || await this.getDefaultSessionState();
    session.botGreetingShown = true;
    await this.setCurrentSession(session);
  }

  async updateDailyStreak(): Promise<{ streak: number; isNewDay: boolean }> {
    const today = new Date().toDateString();
    const lastActivityDate = await this.getLastActivityDate();
    const currentStreak = await this.getCurrentStreak();
    
    let isNewDay = false;
    let newStreak = currentStreak;
    
    if (!lastActivityDate || lastActivityDate !== today) {
      // New day
      isNewDay = true;
      
      if (lastActivityDate) {
        const lastDate = new Date(lastActivityDate);
        const todayDate = new Date(today);
        const daysDifference = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDifference === 1) {
          // Consecutive day
          newStreak = currentStreak + 1;
        } else {
          // Streak broken
          newStreak = 1;
        }
      } else {
        // First activity ever
        newStreak = 1;
      }
      
      await this.setCurrentStreak(newStreak);
      await this.setLastActivityDate(today);
    }
    
    return { streak: newStreak, isNewDay };
  }
}

export default AsyncStorageService.getInstance(); 