import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ProgressIndicator from '../../components/ProgressIndicator';
import AnimatedContainer from '../../components/AnimatedContainer';
import { theme } from '../../constants/theme';
import { AccessibilitySettings, FontSize } from '../../types';
import { convertFontSizeToNumber } from '../../utils';
import { OnboardingService } from '../../services/OnboardingService';

interface AccessibilityPreferencesScreenProps {
  onNext: () => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

const fontSizes: { label: string; value: FontSize; example: string }[] = [
  { label: 'Small', value: 'small', example: 'Aa' },
  { label: 'Medium', value: 'medium', example: 'Aa' },
  { label: 'Large', value: 'large', example: 'Aa' },
  { label: 'Extra Large', value: 'extra-large', example: 'Aa' },
];

const AccessibilityPreferencesScreen: React.FC<AccessibilityPreferencesScreenProps> = ({
  onNext,
  onBack,
  currentStep,
  totalSteps,
}) => {
  const [preferences, setPreferences] = useState<AccessibilitySettings>({
    fontSize: 'medium',
    highContrast: false,
    reducedMotion: false,
    voiceEnabled: true,
    hapticFeedback: true,
    screenReaderEnabled: false,
    visualIndicators: true,
    audioDescriptions: false,
    simplifiedLanguage: false,
    largerTouchTargets: false,
  });

  const updatePreference = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const getFontSizeExample = (size: FontSize): number => {
    return convertFontSizeToNumber(size);
  };

  const handleNext = async () => {
    try {
      // Save accessibility preferences before proceeding
      await OnboardingService.updateAccessibilityPreferences(preferences);
      onNext();
    } catch (error) {
      console.error('Failed to save accessibility preferences:', error);
      // Still proceed to avoid blocking the user
      onNext();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <AnimatedContainer animationType="slideIn" duration={400} style={styles.content}>
          <AnimatedContainer animationType="fadeIn" delay={200}>
            <View style={styles.header}>
              <Text style={styles.title} allowFontScaling={false}>Customize Your Experience ⚙️</Text>
              <Text style={styles.subtitle}>
                Let's set up the app to work best for you. You can change these anytime in Settings.
              </Text>
            </View>
          </AnimatedContainer>

          {/* Font Size Section */}
          <AnimatedContainer animationType="slideIn" delay={300}>
            <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Text Size</Text>
            <Text style={styles.sectionDescription}>
              Choose a text size that's comfortable for you to read
            </Text>
            <View style={styles.fontSizeContainer}>
              {fontSizes.map((size) => (
                <TouchableOpacity
                  key={size.value}
                  style={[
                    styles.fontSizeOption,
                    preferences.fontSize === size.value && styles.selectedFontSize,
                  ]}
                  onPress={() => updatePreference('fontSize', size.value)}
                  accessibilityLabel={`Select ${size.label} text size`}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: preferences.fontSize === size.value }}
                >
                  <Text style={[styles.fontSizeLabel, { fontSize: getFontSizeExample(size.value) }]}>
                    {size.label}
                  </Text>
                  <Text style={[styles.fontSizeExample, { fontSize: getFontSizeExample(size.value) }]} allowFontScaling={false}>
                    {size.example}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            </Card>
          </AnimatedContainer>

          {/* Visual Preferences Section */}
          <AnimatedContainer animationType="slideIn" delay={400}>
            <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Visual Preferences</Text>
            <Text style={styles.sectionDescription}>
              Adjust visual settings for better readability
            </Text>
            
            <View style={styles.switchContainer}>
              <View style={styles.switchRow}>
                <View style={styles.switchInfo}>
                  <Text style={styles.switchLabel}>High Contrast</Text>
                  <Text style={styles.switchDescription}>
                    Darker colors and stronger borders for better visibility
                  </Text>
                </View>
                <Switch
                  value={preferences.highContrast}
                  onValueChange={(value) => updatePreference('highContrast', value)}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor={preferences.highContrast ? theme.colors.background : theme.colors.disabled}
                />
              </View>

              <View style={styles.switchRow}>
                <View style={styles.switchInfo}>
                  <Text style={styles.switchLabel}>Reduced Motion</Text>
                  <Text style={styles.switchDescription}>
                    Minimize animations and transitions
                  </Text>
                </View>
                <Switch
                  value={preferences.reducedMotion}
                  onValueChange={(value) => updatePreference('reducedMotion', value)}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor={preferences.reducedMotion ? theme.colors.background : theme.colors.disabled}
                />
              </View>

              <View style={styles.switchRow}>
                <View style={styles.switchInfo}>
                  <Text style={styles.switchLabel}>Visual Indicators</Text>
                  <Text style={styles.switchDescription}>
                    Show extra visual cues and highlights
                  </Text>
                </View>
                <Switch
                  value={preferences.visualIndicators}
                  onValueChange={(value) => updatePreference('visualIndicators', value)}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor={preferences.visualIndicators ? theme.colors.background : theme.colors.disabled}
                />
              </View>

              <View style={styles.switchRow}>
                <View style={styles.switchInfo}>
                  <Text style={styles.switchLabel}>Larger Touch Targets</Text>
                  <Text style={styles.switchDescription}>
                    Make buttons and interactive elements bigger
                  </Text>
                </View>
                <Switch
                  value={preferences.largerTouchTargets}
                  onValueChange={(value) => updatePreference('largerTouchTargets', value)}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor={preferences.largerTouchTargets ? theme.colors.background : theme.colors.disabled}
                />
              </View>
            </View>
          </Card>

          {/* Audio Preferences Section */}
          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Audio & Feedback</Text>
            <Text style={styles.sectionDescription}>
              Choose how you want to interact with the app
            </Text>
            
            <View style={styles.switchContainer}>
              <View style={styles.switchRow}>
                <View style={styles.switchInfo}>
                  <Text style={styles.switchLabel}>Voice Features</Text>
                  <Text style={styles.switchDescription}>
                    Enable speaking to the app and hearing responses
                  </Text>
                </View>
                <Switch
                  value={preferences.voiceEnabled}
                  onValueChange={(value) => updatePreference('voiceEnabled', value)}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor={preferences.voiceEnabled ? theme.colors.background : theme.colors.disabled}
                />
              </View>

              <View style={styles.switchRow}>
                <View style={styles.switchInfo}>
                  <Text style={styles.switchLabel}>Haptic Feedback</Text>
                  <Text style={styles.switchDescription}>
                    Feel gentle vibrations for button presses
                  </Text>
                </View>
                <Switch
                  value={preferences.hapticFeedback}
                  onValueChange={(value) => updatePreference('hapticFeedback', value)}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor={preferences.hapticFeedback ? theme.colors.background : theme.colors.disabled}
                />
              </View>

              <View style={styles.switchRow}>
                <View style={styles.switchInfo}>
                  <Text style={styles.switchLabel}>Simplified Language</Text>
                  <Text style={styles.switchDescription}>
                    Use simpler words and shorter sentences
                  </Text>
                </View>
                <Switch
                  value={preferences.simplifiedLanguage}
                  onValueChange={(value) => updatePreference('simplifiedLanguage', value)}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor={preferences.simplifiedLanguage ? theme.colors.background : theme.colors.disabled}
                />
              </View>
            </View>
          </Card>

          <Card style={styles.helpCard}>
            <Text style={styles.helpTitle}>💡 Did you know?</Text>
            <Text style={styles.helpText}>
              These settings help make the app work better for your needs. You can always change them later in the Settings menu.
            </Text>
            </Card>
          </AnimatedContainer>
        </AnimatedContainer>
      </ScrollView>

      <AnimatedContainer animationType="slideIn" delay={700} style={styles.buttonContainer}>
        <Button
          title="Back"
          onPress={onBack}
          variant="outline"
          size="large"
          style={styles.backButton}
        />
        <Button
          title="Continue"
          onPress={handleNext}
          size="large"
          style={styles.nextButton}
        />
      </AnimatedContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.md,
  },
  sectionCard: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  sectionDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.md,
    lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.sm,
  },
  fontSizeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  fontSizeOption: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  selectedFontSize: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },
  fontSizeLabel: {
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  fontSizeExample: {
    color: theme.colors.textLight,
    fontWeight: theme.typography.fontWeight.bold,
  },
  switchContainer: {
    marginTop: theme.spacing.sm,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  switchInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  switchLabel: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  switchDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.sm,
  },
  helpCard: {
    backgroundColor: theme.colors.surfaceLight,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    marginBottom: theme.spacing.xl,
  },
  helpTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  helpText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.sm,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.screenPadding,
    paddingVertical: theme.spacing.md,
  },
  backButton: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  nextButton: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
});

export default AccessibilityPreferencesScreen; 