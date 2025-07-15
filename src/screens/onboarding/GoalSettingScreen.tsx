import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ProgressIndicator from '../../components/ProgressIndicator';
import AnimatedContainer from '../../components/AnimatedContainer';
import { theme } from '../../constants/theme';
import { OnboardingService } from '../../services/OnboardingService';

interface GoalSettingScreenProps {
  onNext: () => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

type Goal = {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
};

const goals: Goal[] = [
  {
    id: 'social_skills',
    title: 'Social Skills',
    description: 'Making friends & conversations',
    icon: '👥',
    color: theme.colors.primary,
  },
  {
    id: 'emotions',
    title: 'Understanding Emotions',
    description: 'Recognizing feelings in others',
    icon: '😊',
    color: theme.colors.success,
  },
  {
    id: 'communication',
    title: 'Communication',
    description: 'Expressing thoughts & needs',
    icon: '💬',
    color: theme.colors.warning,
  },
  {
    id: 'self_regulation',
    title: 'Self-Regulation',
    description: 'Managing big emotions',
    icon: '🧘',
    color: theme.colors.secondary,
  },
];

const GoalSettingScreen: React.FC<GoalSettingScreenProps> = ({ 
  onNext, 
  onBack, 
  currentStep, 
  totalSteps 
}) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const isGoalSelected = (goalId: string) => selectedGoals.includes(goalId);

  const canContinue = selectedGoals.length > 0;

  const handleNext = async () => {
    try {
      // Save selected goals before proceeding
      await OnboardingService.updateSelectedGoals(selectedGoals);
      onNext();
    } catch (error) {
      console.error('Failed to save selected goals:', error);
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
              <Text style={styles.title} allowFontScaling={false}>What would you like to work on? 🎯</Text>
              <Text style={styles.subtitle}>
                Select all the areas you're interested in. You can always change these later!
              </Text>
            </View>
          </AnimatedContainer>

          <AnimatedContainer animationType="slideIn" delay={300}>
            <View style={styles.goalsContainer}>
              {goals.map((goal, index) => (
                <AnimatedContainer key={goal.id} animationType="scaleIn" delay={400 + index * 100}>
                  <TouchableOpacity
                    style={[
                      styles.goalCard,
                      isGoalSelected(goal.id) && styles.selectedGoalCard,
                    ]}
                    onPress={() => toggleGoal(goal.id)}
                    accessibilityLabel={`${goal.title}: ${goal.description}`}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: isGoalSelected(goal.id) }}
                  >
                    <View style={styles.goalHeader}>
                      <View style={[styles.goalIcon, { backgroundColor: goal.color }]}>
                        <Text style={styles.goalEmoji} allowFontScaling={false}>{goal.icon}</Text>
                      </View>
                      <View style={styles.checkboxContainer}>
                        <View style={[
                          styles.checkbox,
                          isGoalSelected(goal.id) && styles.checkboxSelected
                        ]}>
                          {isGoalSelected(goal.id) && (
                            <Text style={styles.checkmark} allowFontScaling={false}>✓</Text>
                          )}
                        </View>
                      </View>
                    </View>
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                    <Text style={styles.goalDescription}>{goal.description}</Text>
                  </TouchableOpacity>
                </AnimatedContainer>
              ))}
            </View>
          </AnimatedContainer>

          <Card style={styles.helpCard}>
            <Text style={styles.helpTitle}>Need help choosing?</Text>
            <Text style={styles.helpText}>
              Don't worry! These goals help me understand what you'd like to focus on. 
              We'll work on them together at your own pace.
            </Text>
          </Card>
        </AnimatedContainer>
      </ScrollView>

      <AnimatedContainer animationType="slideIn" delay={600} style={styles.buttonContainer}>
        <Button
          title="Back"
          onPress={onBack}
          variant="outline"
          size="large"
          style={styles.backButton}
        />
        <Button
          title={`Continue ${selectedGoals.length > 0 ? `(${selectedGoals.length})` : ''}`}
          onPress={handleNext}
          size="large"
          style={styles.nextButton}
          disabled={!canContinue}
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
  goalsContainer: {
    marginBottom: theme.spacing.lg,
  },
  goalCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  selectedGoalCard: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  goalIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalEmoji: {
    fontSize: 24,
  },
  checkboxContainer: {
    paddingLeft: theme.spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkmark: {
    color: theme.colors.background,
    fontSize: 14,
    fontWeight: theme.typography.fontWeight.bold,
  },
  goalTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  goalDescription: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.md,
  },
  helpCard: {
    backgroundColor: theme.colors.primaryLight,
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

export default GoalSettingScreen; 