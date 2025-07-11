/**
 * BuddyBot Validation Service
 * Data validation and sanitization for autism support app
 */

import { 
  UserProfile, 
  ActivitySession, 
  SkillProgress, 
  ChatMessage, 
  Achievement,
  ActivityResult,
  ValidationRule,
  AgeGroup,
  ActivityType,
  SkillCategory,
  MoodState,
  DifficultyLevel
} from '../types';

// =============================================================================
// VALIDATION RULES & SCHEMAS
// =============================================================================

export class ValidationService {
  private static instance: ValidationService;

  private constructor() {}

  public static getInstance(): ValidationService {
    if (!ValidationService.instance) {
      ValidationService.instance = new ValidationService();
    }
    return ValidationService.instance;
  }

  // =============================================================================
  // CORE VALIDATION METHODS
  // =============================================================================

  validateField(value: any, rule: ValidationRule): { isValid: boolean; error?: string } {
    // Required field check
    if (rule.required && (value === null || value === undefined || value === '')) {
      return { isValid: false, error: `${rule.field} is required` };
    }

    // If value is empty and not required, it's valid
    if (!rule.required && (value === null || value === undefined || value === '')) {
      return { isValid: true };
    }

    // Type validation
    if (!this.validateType(value, rule.type)) {
      return { isValid: false, error: `${rule.field} must be of type ${rule.type}` };
    }

    // String validations
    if (rule.type === 'string' && typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        return { isValid: false, error: `${rule.field} must be at least ${rule.minLength} characters` };
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        return { isValid: false, error: `${rule.field} must be no more than ${rule.maxLength} characters` };
      }
      if (rule.pattern && !rule.pattern.test(value)) {
        return { isValid: false, error: `${rule.field} format is invalid` };
      }
    }

    // Custom validation
    if (rule.customValidator && !rule.customValidator(value)) {
      return { isValid: false, error: `${rule.field} failed custom validation` };
    }

    return { isValid: true };
  }

  private validateType(value: any, type: string): boolean {
    switch (type) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number' && !isNaN(value);
      case 'boolean':
        return typeof value === 'boolean';
      case 'array':
        return Array.isArray(value);
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value);
      default:
        return true;
    }
  }

  // =============================================================================
  // USER PROFILE VALIDATION
  // =============================================================================

  validateUserProfile(profile: Partial<UserProfile>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    const rules: ValidationRule[] = [
      { field: 'displayName', required: true, type: 'string', minLength: 1, maxLength: 50 },
      { field: 'ageGroup', required: true, type: 'string', customValidator: (v) => this.isValidAgeGroup(v) },
      { field: 'userId', required: true, type: 'string', pattern: /^[a-zA-Z0-9_-]+$/ },
      { 
        field: 'guardianEmail', 
        required: false, 
        type: 'string', 
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        customValidator: (v) => this.validateGuardianEmailRequired(profile.ageGroup, v)
      }
    ];

    for (const rule of rules) {
      const value = (profile as any)[rule.field];
      const result = this.validateField(value, rule);
      if (!result.isValid && result.error) {
        errors.push(result.error);
      }
    }

    // Validate nested objects
    if (profile.avatarConfig) {
      const avatarValidation = this.validateAvatarConfig(profile.avatarConfig);
      if (!avatarValidation.isValid) {
        errors.push(...avatarValidation.errors);
      }
    }

    if (profile.accessibilityPreferences) {
      const accessibilityValidation = this.validateAccessibilitySettings(profile.accessibilityPreferences);
      if (!accessibilityValidation.isValid) {
        errors.push(...accessibilityValidation.errors);
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  private isValidAgeGroup(ageGroup: any): boolean {
    const validAgeGroups: AgeGroup[] = ['6-12', '13-18', '19-24'];
    return validAgeGroups.includes(ageGroup);
  }

  private validateGuardianEmailRequired(ageGroup: any, email: any): boolean {
    // COPPA compliance: require guardian email for users under 13
    if (ageGroup === '6-12') {
      return typeof email === 'string' && email.length > 0;
    }
    return true; // Not required for older users
  }

  // =============================================================================
  // ACTIVITY SESSION VALIDATION
  // =============================================================================

  validateActivitySession(session: Partial<ActivitySession>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    const rules: ValidationRule[] = [
      { field: 'userId', required: true, type: 'string' },
      { field: 'activityType', required: true, type: 'string', customValidator: (v) => this.isValidActivityType(v) },
      { field: 'startedAt', required: true, type: 'string', customValidator: (v) => this.isValidTimestamp(v) },
      { field: 'difficultyLevel', required: true, type: 'number', customValidator: (v) => this.isValidDifficultyLevel(v) },
      { field: 'deviceId', required: true, type: 'string' },
      { field: 'appVersion', required: true, type: 'string' }
    ];

    // Optional fields with validation
    if (session.completedAt) {
      rules.push({ field: 'completedAt', required: false, type: 'string', customValidator: (v) => this.isValidTimestamp(v) });
    }
    if (session.score !== undefined) {
      rules.push({ field: 'score', required: false, type: 'number', customValidator: (v) => v >= 0 && v <= 100 });
    }
    if (session.accuracyPercentage !== undefined) {
      rules.push({ field: 'accuracyPercentage', required: false, type: 'number', customValidator: (v) => v >= 0 && v <= 100 });
    }
    if (session.stressLevelBefore !== undefined) {
      rules.push({ field: 'stressLevelBefore', required: false, type: 'number', customValidator: (v) => v >= 1 && v <= 10 });
    }
    if (session.stressLevelAfter !== undefined) {
      rules.push({ field: 'stressLevelAfter', required: false, type: 'number', customValidator: (v) => v >= 1 && v <= 10 });
    }

    for (const rule of rules) {
      const value = (session as any)[rule.field];
      const result = this.validateField(value, rule);
      if (!result.isValid && result.error) {
        errors.push(result.error);
      }
    }

    // Validate mood states
    if (session.moodBefore && !this.isValidMoodState(session.moodBefore)) {
      errors.push('Invalid mood state before activity');
    }
    if (session.moodAfter && !this.isValidMoodState(session.moodAfter)) {
      errors.push('Invalid mood state after activity');
    }

    // Logical validations
    if (session.startedAt && session.completedAt) {
      const startTime = new Date(session.startedAt);
      const endTime = new Date(session.completedAt);
      if (endTime <= startTime) {
        errors.push('Completion time must be after start time');
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  private isValidActivityType(activityType: any): boolean {
    const validTypes: ActivityType[] = [
      'social_flashcards', 'emotion_recognition', 'breathing_exercise',
      'role_play_scenario', 'communication_practice', 'self_regulation_tools',
      'daily_check_in', 'mindfulness_activity'
    ];
    return validTypes.includes(activityType);
  }

  private isValidDifficultyLevel(level: any): boolean {
    const validLevels: DifficultyLevel[] = [1, 2, 3, 4, 5];
    return validLevels.includes(level);
  }

  private isValidMoodState(mood: any): boolean {
    const validMoods: MoodState[] = [
      'very_happy', 'happy', 'okay', 'sad', 'very_sad',
      'excited', 'calm', 'nervous', 'angry', 'frustrated',
      'confused', 'proud', 'disappointed', 'grateful'
    ];
    return validMoods.includes(mood);
  }

  private isValidTimestamp(timestamp: any): boolean {
    if (typeof timestamp !== 'string') return false;
    const date = new Date(timestamp);
    return !isNaN(date.getTime()) && date.toISOString() === timestamp;
  }

  // =============================================================================
  // SKILL PROGRESS VALIDATION
  // =============================================================================

  validateSkillProgress(progress: Partial<SkillProgress>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    const rules: ValidationRule[] = [
      { field: 'userId', required: true, type: 'string' },
      { field: 'skillCategory', required: true, type: 'string', customValidator: (v) => this.isValidSkillCategory(v) },
      { field: 'currentLevel', required: true, type: 'number', customValidator: (v) => v >= 1 && v <= 10 },
      { field: 'progressPercentage', required: true, type: 'number', customValidator: (v) => v >= 0 && v <= 100 },
      { field: 'sessionsCompleted', required: true, type: 'number', customValidator: (v) => v >= 0 },
      { field: 'lastUpdated', required: true, type: 'string', customValidator: (v) => this.isValidTimestamp(v) },
      { field: 'deviceId', required: true, type: 'string' }
    ];

    for (const rule of rules) {
      const value = (progress as any)[rule.field];
      const result = this.validateField(value, rule);
      if (!result.isValid && result.error) {
        errors.push(result.error);
      }
    }

    // Validate arrays
    if (progress.milestonesReached && !Array.isArray(progress.milestonesReached)) {
      errors.push('Milestones reached must be an array');
    }
    if (progress.strengths && !Array.isArray(progress.strengths)) {
      errors.push('Strengths must be an array');
    }
    if (progress.areasForGrowth && !Array.isArray(progress.areasForGrowth)) {
      errors.push('Areas for growth must be an array');
    }

    return { isValid: errors.length === 0, errors };
  }

  private isValidSkillCategory(category: any): boolean {
    const validCategories: SkillCategory[] = [
      'social_skills', 'emotional_awareness', 'communication',
      'self_regulation', 'coping_strategies', 'independence', 'sensory_management'
    ];
    return validCategories.includes(category);
  }

  // =============================================================================
  // CHAT MESSAGE VALIDATION
  // =============================================================================

  validateChatMessage(message: Partial<ChatMessage>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    const rules: ValidationRule[] = [
      { field: 'userId', required: true, type: 'string' },
      { field: 'conversationSessionId', required: true, type: 'string' },
      { field: 'messageText', required: true, type: 'string', minLength: 1, maxLength: 1000 },
      { field: 'messageType', required: true, type: 'string' },
      { field: 'isBotMessage', required: true, type: 'boolean' },
      { field: 'timestamp', required: true, type: 'string', customValidator: (v) => this.isValidTimestamp(v) },
      { field: 'deviceId', required: true, type: 'string' }
    ];

    for (const rule of rules) {
      const value = (message as any)[rule.field];
      const result = this.validateField(value, rule);
      if (!result.isValid && result.error) {
        errors.push(result.error);
      }
    }

    // Validate mood context if provided
    if (message.moodContext && !this.isValidMoodState(message.moodContext)) {
      errors.push('Invalid mood context');
    }

    // Validate effectiveness rating if provided
    if (message.effectivenessRating !== undefined && 
        (message.effectivenessRating < 1 || message.effectivenessRating > 5)) {
      errors.push('Effectiveness rating must be between 1 and 5');
    }

    return { isValid: errors.length === 0, errors };
  }

  // =============================================================================
  // NESTED OBJECT VALIDATION
  // =============================================================================

  validateAvatarConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config || typeof config !== 'object') {
      return { isValid: false, errors: ['Avatar config must be an object'] };
    }

    const rules: ValidationRule[] = [
      { field: 'bodyType', required: true, type: 'string', customValidator: (v) => ['robot', 'animal', 'person'].includes(v) },
      { field: 'primaryColor', required: true, type: 'string', pattern: /^#[0-9A-F]{6}$/i },
      { field: 'accessories', required: true, type: 'array' },
      { field: 'name', required: true, type: 'string', minLength: 1, maxLength: 20 },
      { field: 'expressions', required: true, type: 'array' }
    ];

    for (const rule of rules) {
      const value = config[rule.field];
      const result = this.validateField(value, rule);
      if (!result.isValid && result.error) {
        errors.push(result.error);
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  validateAccessibilitySettings(settings: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!settings || typeof settings !== 'object') {
      return { isValid: false, errors: ['Accessibility settings must be an object'] };
    }

    const booleanFields = [
      'highContrast', 'reducedMotion', 'voiceEnabled', 'hapticFeedback',
      'screenReaderEnabled', 'visualIndicators', 'audioDescriptions',
      'simplifiedLanguage', 'largerTouchTargets'
    ];

    for (const field of booleanFields) {
      if (settings[field] !== undefined && typeof settings[field] !== 'boolean') {
        errors.push(`${field} must be a boolean`);
      }
    }

    if (settings.fontSize && !['small', 'medium', 'large', 'extra-large'].includes(settings.fontSize)) {
      errors.push('Invalid font size');
    }

    return { isValid: errors.length === 0, errors };
  }

  // =============================================================================
  // SANITIZATION METHODS
  // =============================================================================

  sanitizeUserInput(input: string): string {
    if (typeof input !== 'string') return '';
    
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .slice(0, 1000); // Limit length
  }

  sanitizeDisplayName(name: string): string {
    if (typeof name !== 'string') return '';
    
    return name
      .trim()
      .replace(/[^a-zA-Z0-9\s\-_]/g, '') // Allow only alphanumeric, spaces, hyphens, underscores
      .slice(0, 50);
  }

  sanitizeEmail(email: string): string {
    if (typeof email !== 'string') return '';
    
    return email
      .trim()
      .toLowerCase()
      .slice(0, 100);
  }

  // =============================================================================
  // AUTISM-SPECIFIC VALIDATIONS
  // =============================================================================

  validateActivityDuration(durationSeconds: number, activityType: ActivityType): { isValid: boolean; error?: string } {
    const maxDurations: Record<ActivityType, number> = {
      'social_flashcards': 1800, // 30 minutes
      'emotion_recognition': 1200, // 20 minutes
      'breathing_exercise': 600, // 10 minutes
      'role_play_scenario': 2400, // 40 minutes
      'communication_practice': 1800, // 30 minutes
      'self_regulation_tools': 900, // 15 minutes
      'daily_check_in': 300, // 5 minutes
      'mindfulness_activity': 1200 // 20 minutes
    };

    const maxDuration = maxDurations[activityType];
    
    if (durationSeconds < 0) {
      return { isValid: false, error: 'Duration cannot be negative' };
    }
    
    if (durationSeconds > maxDuration) {
      return { isValid: false, error: `Duration too long for ${activityType} (max: ${maxDuration} seconds)` };
    }
    
    return { isValid: true };
  }

  validateAgeAppropriateContent(content: string, ageGroup: AgeGroup): { isValid: boolean; error?: string } {
    // Simple content validation for age appropriateness
    const inappropriateWords = ['violence', 'scary', 'death', 'war'];
    const contentLower = content.toLowerCase();
    
    for (const word of inappropriateWords) {
      if (contentLower.includes(word)) {
        return { isValid: false, error: `Content contains inappropriate word: ${word}` };
      }
    }
    
    // Check complexity for younger users
    if (ageGroup === '6-12') {
      const words = content.split(/\s+/);
      const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
      
      if (avgWordLength > 8) {
        return { isValid: false, error: 'Content too complex for age group 6-12' };
      }
    }
    
    return { isValid: true };
  }
}

export default ValidationService.getInstance(); 