/**
 * BuddyBot SQLite Service
 * Comprehensive database service with sync support for offline-first architecture
 */

import * as SQLite from 'expo-sqlite';
import { 
  UserProfile, 
  ActivitySession, 
  SkillProgress, 
  ChatMessage, 
  Achievement, 
  ActivityResult,
  SyncOperation,
  AppError,
  SyncStatus 
} from '../types';

export class SQLiteService {
  private static instance: SQLiteService;
  private db: SQLite.WebSQLDatabase | null = null;
  private readonly DB_NAME = 'buddybot.db';
  private readonly DB_VERSION = 1;

  private constructor() {}

  public static getInstance(): SQLiteService {
    if (!SQLiteService.instance) {
      SQLiteService.instance = new SQLiteService();
    }
    return SQLiteService.instance;
  }

  // =============================================================================
  // DATABASE INITIALIZATION
  // =============================================================================

  async initializeDatabase(): Promise<void> {
    try {
      this.db = SQLite.openDatabase(this.DB_NAME);
      await this.createTables();
      await this.createIndices();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw new Error('Database initialization failed');
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const tables = [
      this.getUserProfileTableSchema(),
      this.getActivitySessionsTableSchema(),
      this.getSkillProgressTableSchema(),
      this.getChatMessagesTableSchema(),
      this.getAchievementsTableSchema(),
      this.getActivityResultsTableSchema(),
      this.getSyncLogTableSchema(),
      this.getErrorLogTableSchema()
    ];

    for (const tableSchema of tables) {
      await this.executeSQL(tableSchema);
    }
  }

  private async createIndices(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const indices = [
      'CREATE INDEX IF NOT EXISTS idx_user_profile_user_id ON user_profile(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_activity_sessions_user_id ON activity_sessions(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_activity_sessions_type ON activity_sessions(activity_type)',
      'CREATE INDEX IF NOT EXISTS idx_activity_sessions_date ON activity_sessions(completed_at)',
      'CREATE INDEX IF NOT EXISTS idx_skill_progress_user_id ON skill_progress(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_skill_progress_category ON skill_progress(skill_category)',
      'CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(conversation_session_id)',
      'CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_activity_results_session ON activity_results(session_id)',
      'CREATE INDEX IF NOT EXISTS idx_sync_status ON activity_sessions(sync_status)',
      'CREATE INDEX IF NOT EXISTS idx_sync_log_user ON sync_log(user_id)'
    ];

    for (const index of indices) {
      await this.executeSQL(index);
    }
  }

  // =============================================================================
  // TABLE SCHEMAS
  // =============================================================================

  private getUserProfileTableSchema(): string {
    return `
      CREATE TABLE IF NOT EXISTS user_profile (
        id TEXT PRIMARY KEY,
        user_id TEXT UNIQUE,
        display_name TEXT NOT NULL,
        age_group TEXT NOT NULL,
        guardian_email TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        synced_at TEXT,
        sync_status TEXT DEFAULT 'pending',
        avatar_config TEXT NOT NULL,
        accessibility_preferences TEXT NOT NULL,
        selected_goals TEXT NOT NULL,
        privacy_settings TEXT NOT NULL,
        device_id TEXT NOT NULL
      )
    `;
  }

  private getActivitySessionsTableSchema(): string {
    return `
      CREATE TABLE IF NOT EXISTS activity_sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        activity_type TEXT NOT NULL,
        activity_subtype TEXT,
        started_at TEXT NOT NULL,
        completed_at TEXT,
        duration_seconds INTEGER,
        score INTEGER,
        accuracy_percentage REAL,
        difficulty_level INTEGER NOT NULL,
        mood_before TEXT,
        mood_after TEXT,
        stress_level_before INTEGER,
        stress_level_after INTEGER,
        device_id TEXT NOT NULL,
        app_version TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        synced_at TEXT,
        sync_status TEXT DEFAULT 'pending',
        FOREIGN KEY (user_id) REFERENCES user_profile(user_id)
      )
    `;
  }

  private getSkillProgressTableSchema(): string {
    return `
      CREATE TABLE IF NOT EXISTS skill_progress (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        skill_category TEXT NOT NULL,
        skill_subcategory TEXT,
        current_level INTEGER NOT NULL,
        progress_percentage REAL NOT NULL,
        sessions_completed INTEGER DEFAULT 0,
        milestones_reached TEXT,
        last_milestone_date TEXT,
        next_milestone_target TEXT,
        assessment_results TEXT,
        strengths TEXT,
        areas_for_growth TEXT,
        last_updated TEXT NOT NULL,
        device_id TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        synced_at TEXT,
        sync_status TEXT DEFAULT 'pending',
        FOREIGN KEY (user_id) REFERENCES user_profile(user_id)
      )
    `;
  }

  private getChatMessagesTableSchema(): string {
    return `
      CREATE TABLE IF NOT EXISTS chat_messages (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        conversation_session_id TEXT NOT NULL,
        message_text TEXT NOT NULL,
        message_type TEXT NOT NULL,
        is_bot_message INTEGER NOT NULL,
        timestamp TEXT NOT NULL,
        mood_context TEXT,
        activity_context TEXT,
        intent_category TEXT,
        therapeutic_goal TEXT,
        intervention_type TEXT,
        effectiveness_rating INTEGER,
        device_id TEXT NOT NULL,
        created_at TEXT NOT NULL,
        synced_at TEXT,
        sync_status TEXT DEFAULT 'pending',
        FOREIGN KEY (user_id) REFERENCES user_profile(user_id)
      )
    `;
  }

  private getAchievementsTableSchema(): string {
    return `
      CREATE TABLE IF NOT EXISTS achievements (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        achievement_type TEXT NOT NULL,
        badge_category TEXT NOT NULL,
        badge_name TEXT NOT NULL,
        badge_icon TEXT NOT NULL,
        description TEXT NOT NULL,
        earned_at TEXT NOT NULL,
        activity_trigger TEXT,
        skill_related TEXT,
        celebration_shown INTEGER DEFAULT 0,
        shared_with_guardian INTEGER DEFAULT 0,
        device_id TEXT NOT NULL,
        created_at TEXT NOT NULL,
        synced_at TEXT,
        sync_status TEXT DEFAULT 'pending',
        FOREIGN KEY (user_id) REFERENCES user_profile(user_id)
      )
    `;
  }

  private getActivityResultsTableSchema(): string {
    return `
      CREATE TABLE IF NOT EXISTS activity_results (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        item_type TEXT NOT NULL,
        item_content TEXT NOT NULL,
        item_difficulty INTEGER NOT NULL,
        user_response TEXT NOT NULL,
        response_time_ms INTEGER NOT NULL,
        correct INTEGER NOT NULL,
        confidence_level INTEGER,
        mistake_type TEXT,
        learning_opportunity TEXT,
        completed_at TEXT NOT NULL,
        device_id TEXT NOT NULL,
        synced_at TEXT,
        sync_status TEXT DEFAULT 'pending',
        FOREIGN KEY (session_id) REFERENCES activity_sessions(id),
        FOREIGN KEY (user_id) REFERENCES user_profile(user_id)
      )
    `;
  }

  private getSyncLogTableSchema(): string {
    return `
      CREATE TABLE IF NOT EXISTS sync_log (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        device_id TEXT NOT NULL,
        operation_type TEXT NOT NULL,
        table_name TEXT NOT NULL,
        record_count INTEGER NOT NULL,
        data_size_bytes INTEGER,
        started_at TEXT NOT NULL,
        completed_at TEXT,
        duration_ms INTEGER,
        status TEXT NOT NULL,
        error_code TEXT,
        error_message TEXT,
        records_processed INTEGER,
        conflicts_detected INTEGER,
        conflicts_resolved INTEGER,
        created_at TEXT NOT NULL
      )
    `;
  }

  private getErrorLogTableSchema(): string {
    return `
      CREATE TABLE IF NOT EXISTS error_log (
        id TEXT PRIMARY KEY,
        timestamp TEXT NOT NULL,
        error_type TEXT NOT NULL,
        error_code TEXT NOT NULL,
        message TEXT NOT NULL,
        context TEXT,
        user_id TEXT,
        device_id TEXT NOT NULL,
        resolved INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
      )
    `;
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  private async executeSQL(sql: string, params: any[] = []): Promise<SQLite.SQLResultSet> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      this.db!.transaction(
        (tx) => {
          tx.executeSql(
            sql,
            params,
            (_, result) => resolve(result),
            (_, error) => {
              console.error('SQL Error:', error, 'Query:', sql, 'Params:', params);
              reject(error);
              return false;
            }
          );
        },
        (error) => {
          console.error('Transaction Error:', error);
          reject(error);
        }
      );
    });
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  // =============================================================================
  // USER PROFILE OPERATIONS
  // =============================================================================

  async createUserProfile(profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt' | 'syncStatus'>): Promise<UserProfile> {
    const id = this.generateUUID();
    const timestamp = this.getCurrentTimestamp();
    
    const fullProfile: UserProfile = {
      ...profile,
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
      syncStatus: 'pending' as SyncStatus
    };

    const sql = `
      INSERT INTO user_profile (
        id, user_id, display_name, age_group, guardian_email, created_at, updated_at,
        synced_at, sync_status, avatar_config, accessibility_preferences, 
        selected_goals, privacy_settings, device_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      fullProfile.id,
      fullProfile.userId,
      fullProfile.displayName,
      fullProfile.ageGroup,
      fullProfile.guardianEmail || null,
      fullProfile.createdAt,
      fullProfile.updatedAt,
      fullProfile.syncedAt || null,
      fullProfile.syncStatus,
      JSON.stringify(fullProfile.avatarConfig),
      JSON.stringify(fullProfile.accessibilityPreferences),
      JSON.stringify(fullProfile.selectedGoals),
      JSON.stringify(fullProfile.privacySettings),
      fullProfile.userId // Using userId as deviceId for now
    ];

    await this.executeSQL(sql, params);
    return fullProfile;
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const sql = 'SELECT * FROM user_profile WHERE user_id = ?';
    const result = await this.executeSQL(sql, [userId]);
    
    if (result.rows.length === 0) return null;
    
    const row = result.rows.item(0);
    return {
      id: row.id,
      userId: row.user_id,
      displayName: row.display_name,
      ageGroup: row.age_group,
      guardianEmail: row.guardian_email,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      syncedAt: row.synced_at,
      syncStatus: row.sync_status,
      avatarConfig: JSON.parse(row.avatar_config),
      accessibilityPreferences: JSON.parse(row.accessibility_preferences),
      selectedGoals: JSON.parse(row.selected_goals),
      privacySettings: JSON.parse(row.privacy_settings)
    };
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    const timestamp = this.getCurrentTimestamp();
    
    // Build dynamic SQL based on provided updates
    const updateFields: string[] = [];
    const params: any[] = [];
    
    if (updates.displayName) {
      updateFields.push('display_name = ?');
      params.push(updates.displayName);
    }
    if (updates.avatarConfig) {
      updateFields.push('avatar_config = ?');
      params.push(JSON.stringify(updates.avatarConfig));
    }
    if (updates.accessibilityPreferences) {
      updateFields.push('accessibility_preferences = ?');
      params.push(JSON.stringify(updates.accessibilityPreferences));
    }
    if (updates.selectedGoals) {
      updateFields.push('selected_goals = ?');
      params.push(JSON.stringify(updates.selectedGoals));
    }
    if (updates.privacySettings) {
      updateFields.push('privacy_settings = ?');
      params.push(JSON.stringify(updates.privacySettings));
    }
    
    updateFields.push('updated_at = ?', 'sync_status = ?');
    params.push(timestamp, 'pending');
    params.push(userId);
    
    const sql = `UPDATE user_profile SET ${updateFields.join(', ')} WHERE user_id = ?`;
    await this.executeSQL(sql, params);
  }

  // =============================================================================
  // ACTIVITY SESSION OPERATIONS
  // =============================================================================

  async createActivitySession(session: Omit<ActivitySession, 'id' | 'createdAt' | 'updatedAt' | 'syncStatus'>): Promise<ActivitySession> {
    const id = this.generateUUID();
    const timestamp = this.getCurrentTimestamp();
    
    const fullSession: ActivitySession = {
      ...session,
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
      syncStatus: 'pending' as SyncStatus
    };

    const sql = `
      INSERT INTO activity_sessions (
        id, user_id, activity_type, activity_subtype, started_at, completed_at,
        duration_seconds, score, accuracy_percentage, difficulty_level,
        mood_before, mood_after, stress_level_before, stress_level_after,
        device_id, app_version, created_at, updated_at, synced_at, sync_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      fullSession.id,
      fullSession.userId,
      fullSession.activityType,
      fullSession.activitySubtype || null,
      fullSession.startedAt,
      fullSession.completedAt || null,
      fullSession.durationSeconds || null,
      fullSession.score || null,
      fullSession.accuracyPercentage || null,
      fullSession.difficultyLevel,
      fullSession.moodBefore || null,
      fullSession.moodAfter || null,
      fullSession.stressLevelBefore || null,
      fullSession.stressLevelAfter || null,
      fullSession.deviceId,
      fullSession.appVersion,
      fullSession.createdAt,
      fullSession.updatedAt,
      fullSession.syncedAt || null,
      fullSession.syncStatus
    ];

    await this.executeSQL(sql, params);
    return fullSession;
  }

  async getActivitySessions(userId: string, limit: number = 50): Promise<ActivitySession[]> {
    const sql = `
      SELECT * FROM activity_sessions 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT ?
    `;
    
    const result = await this.executeSQL(sql, [userId, limit]);
    const sessions: ActivitySession[] = [];
    
    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows.item(i);
      sessions.push({
        id: row.id,
        userId: row.user_id,
        activityType: row.activity_type,
        activitySubtype: row.activity_subtype,
        startedAt: row.started_at,
        completedAt: row.completed_at,
        durationSeconds: row.duration_seconds,
        score: row.score,
        accuracyPercentage: row.accuracy_percentage,
        difficultyLevel: row.difficulty_level,
        moodBefore: row.mood_before,
        moodAfter: row.mood_after,
        stressLevelBefore: row.stress_level_before,
        stressLevelAfter: row.stress_level_after,
        deviceId: row.device_id,
        appVersion: row.app_version,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        syncedAt: row.synced_at,
        syncStatus: row.sync_status
      });
    }
    
    return sessions;
  }

  async completeActivitySession(sessionId: string, completionData: {
    completedAt: string;
    score?: number;
    accuracyPercentage?: number;
    moodAfter?: string;
    stressLevelAfter?: number;
  }): Promise<void> {
    const timestamp = this.getCurrentTimestamp();
    
    const sql = `
      UPDATE activity_sessions 
      SET completed_at = ?, score = ?, accuracy_percentage = ?, 
          mood_after = ?, stress_level_after = ?, 
          updated_at = ?, sync_status = ?
      WHERE id = ?
    `;
    
    const params = [
      completionData.completedAt,
      completionData.score || null,
      completionData.accuracyPercentage || null,
      completionData.moodAfter || null,
      completionData.stressLevelAfter || null,
      timestamp,
      'pending',
      sessionId
    ];
    
    await this.executeSQL(sql, params);
  }

  // =============================================================================
  // SYNC OPERATIONS
  // =============================================================================

  async getUnsyncedRecords(tableName: string): Promise<any[]> {
    const sql = `SELECT * FROM ${tableName} WHERE sync_status = 'pending'`;
    const result = await this.executeSQL(sql);
    
    const records: any[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      records.push(result.rows.item(i));
    }
    
    return records;
  }

  async markAsSynced(tableName: string, recordIds: string[]): Promise<void> {
    const timestamp = this.getCurrentTimestamp();
    const placeholders = recordIds.map(() => '?').join(',');
    
    const sql = `
      UPDATE ${tableName} 
      SET sync_status = 'synced', synced_at = ? 
      WHERE id IN (${placeholders})
    `;
    
    await this.executeSQL(sql, [timestamp, ...recordIds]);
  }

  async logSyncOperation(operation: Omit<SyncOperation, 'id' | 'createdAt'>): Promise<void> {
    const id = this.generateUUID();
    const timestamp = this.getCurrentTimestamp();
    
    const sql = `
      INSERT INTO sync_log (
        id, user_id, device_id, operation_type, table_name, record_count,
        data_size_bytes, started_at, completed_at, duration_ms, status,
        error_code, error_message, records_processed, conflicts_detected,
        conflicts_resolved, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      id,
      operation.userId,
      operation.deviceId,
      operation.operationType,
      operation.tableName,
      operation.recordCount,
      operation.dataSizeBytes || null,
      operation.startedAt,
      operation.completedAt || null,
      operation.durationMs || null,
      operation.status,
      operation.errorCode || null,
      operation.errorMessage || null,
      operation.recordsProcessed || null,
      operation.conflictsDetected || null,
      operation.conflictsResolved || null,
      timestamp
    ];
    
    await this.executeSQL(sql, params);
  }

  // =============================================================================
  // ERROR LOGGING
  // =============================================================================

  async logError(error: Omit<AppError, 'id'>): Promise<void> {
    const id = this.generateUUID();
    const timestamp = this.getCurrentTimestamp();
    
    const sql = `
      INSERT INTO error_log (
        id, timestamp, error_type, error_code, message, context,
        user_id, device_id, resolved, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      id,
      error.timestamp,
      error.errorType,
      error.errorCode,
      error.message,
      error.context ? JSON.stringify(error.context) : null,
      error.userId || null,
      error.deviceId,
      error.resolved ? 1 : 0,
      timestamp
    ];
    
    await this.executeSQL(sql, params);
  }

  // =============================================================================
  // DATABASE MAINTENANCE
  // =============================================================================

  async cleanOldRecords(daysToKeep: number = 365): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    const cutoffTimestamp = cutoffDate.toISOString();
    
    // Clean old sync logs
    await this.executeSQL(
      'DELETE FROM sync_log WHERE created_at < ?',
      [cutoffTimestamp]
    );
    
    // Clean old error logs
    await this.executeSQL(
      'DELETE FROM error_log WHERE created_at < ? AND resolved = 1',
      [cutoffTimestamp]
    );
  }

  async getDatabaseStats(): Promise<Record<string, number>> {
    const tables = [
      'user_profile', 'activity_sessions', 'skill_progress', 
      'chat_messages', 'achievements', 'activity_results',
      'sync_log', 'error_log'
    ];
    
    const stats: Record<string, number> = {};
    
    for (const table of tables) {
      const result = await this.executeSQL(`SELECT COUNT(*) as count FROM ${table}`);
      stats[table] = result.rows.item(0).count;
    }
    
    return stats;
  }
}

export default SQLiteService.getInstance(); 