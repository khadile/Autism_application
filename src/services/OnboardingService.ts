import AsyncStorage from '@react-native-async-storage/async-storage';
import { AccessibilitySettings, FontSize } from '../types';
import { convertFontSizeToNumber } from '../utils';

export interface OnboardingData {
  isComplete: boolean;
  avatarConfig: {
    color: string;
    style: string;
    name: string;
  };
  selectedGoals: string[];
  accessibilityPreferences: AccessibilitySettings;
  userName?: string;
  completedAt?: string;
}

export class OnboardingService {
  private static readonly STORAGE_KEY = '@buddybot_onboarding';

  static async saveOnboardingData(data: Partial<OnboardingData>): Promise<void> {
    try {
      const existingData = await this.getOnboardingData();
      const updatedData = { ...existingData, ...data };
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedData));
    } catch (error) {
      console.error('Failed to save onboarding data:', error);
    }
  }

  static async getOnboardingData(): Promise<OnboardingData> {
    try {
      const data = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to get onboarding data:', error);
    }
    
    // Return default data if nothing is saved
    return this.getDefaultOnboardingData();
  }

  static async completeOnboarding(): Promise<void> {
    try {
      await this.saveOnboardingData({
        isComplete: true,
        completedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    }
  }

  static async isOnboardingComplete(): Promise<boolean> {
    try {
      const data = await this.getOnboardingData();
      return data.isComplete;
    } catch (error) {
      console.error('Failed to check onboarding status:', error);
      return false;
    }
  }

  static async resetOnboarding(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to reset onboarding:', error);
    }
  }

  private static getDefaultOnboardingData(): OnboardingData {
    return {
      isComplete: false,
      avatarConfig: {
        color: '#87CEEB',
        style: 'friendly',
        name: 'Buddy',
      },
      selectedGoals: [],
      accessibilityPreferences: {
        fontSize: 'medium' as FontSize,
        highContrast: false,
        reducedMotion: false,
        voiceEnabled: true,
        hapticFeedback: true,
        screenReaderEnabled: false,
        visualIndicators: true,
        audioDescriptions: false,
        simplifiedLanguage: false,
        largerTouchTargets: false,
      },
    };
  }

  // Helper methods for specific data updates
  static async updateAvatarConfig(config: Partial<OnboardingData['avatarConfig']>): Promise<void> {
    const data = await this.getOnboardingData();
    await this.saveOnboardingData({
      avatarConfig: { ...data.avatarConfig, ...config },
    });
  }

  static async updateSelectedGoals(goals: string[]): Promise<void> {
    await this.saveOnboardingData({ selectedGoals: goals });
  }

  static async updateAccessibilityPreferences(preferences: AccessibilitySettings): Promise<void> {
    await this.saveOnboardingData({ accessibilityPreferences: preferences });
  }

  static async updateUserName(name: string): Promise<void> {
    await this.saveOnboardingData({ userName: name });
  }
} 