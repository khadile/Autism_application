import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ProgressIndicator from '../../components/ProgressIndicator';
import AnimatedContainer from '../../components/AnimatedContainer';
import { theme } from '../../constants/theme';

interface WelcomeScreenProps {
  onNext: () => void;
  currentStep: number;
  totalSteps: number;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext, currentStep, totalSteps }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
          <AnimatedContainer animationType="scaleIn" duration={500} style={styles.header}>
            <View style={styles.emojiContainer}>
          <Text style={styles.emoji} allowFontScaling={false}>🤖</Text>
              <View style={styles.emojiGlow} />
            </View>
          <Text style={styles.title} allowFontScaling={false}>Welcome to BuddyBot!</Text>
            <Text style={styles.subtitle}>Your AI companion for social skills</Text>
          </AnimatedContainer>

          <AnimatedContainer animationType="fadeIn" delay={200}>
            <Card style={styles.quickStartCard}>
              <Text style={styles.quickStartTitle}>Let's get started! 🚀</Text>
              <Text style={styles.quickStartText}>
                We'll create your avatar and set up your preferences
          </Text>
        </Card>
          </AnimatedContainer>

          <AnimatedContainer animationType="slideIn" delay={300}>
            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>What we'll do:</Text>
              <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                  <Text style={styles.featureEmoji} allowFontScaling={false}>🎨</Text>
                  <Text style={styles.featureText} allowFontScaling={false}>Create avatar</Text>
                </View>
                
                <View style={styles.featureItem}>
                  <Text style={styles.featureEmoji} allowFontScaling={false}>🎯</Text>
                  <Text style={styles.featureText} allowFontScaling={false}>Choose goals</Text>
                </View>
                
                <View style={styles.featureItem}>
                  <Text style={styles.featureEmoji} allowFontScaling={false}>⚙️</Text>
                  <Text style={styles.featureText} allowFontScaling={false}>Set preferences</Text>
                </View>
                
                <View style={styles.featureItem}>
                  <Text style={styles.featureEmoji} allowFontScaling={false}>💬</Text>
                  <Text style={styles.featureText} allowFontScaling={false}>Meet your AI</Text>
                </View>
              </View>
            </View>
          </AnimatedContainer>

          <AnimatedContainer animationType="fadeIn" delay={400}>
        <Card style={styles.encouragementCard}>
              <Text style={styles.encouragementTitle}>💝 Remember:</Text>
          <Text style={styles.encouragementText}>
                Go at your pace - you can change anything later!
          </Text>
        </Card>
          </AnimatedContainer>
      </View>
      </ScrollView>

      <AnimatedContainer animationType="slideIn" delay={500} style={styles.buttonContainer}>
        <Button
          title="Start Your Journey ✨"
          onPress={onNext}
          size="large"
          style={styles.button}
          accessibilityLabel="Start the onboarding process"
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
    paddingTop: theme.spacing.sm,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  emojiContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
  },
  emoji: {
    fontSize: 80,
    textAlign: 'center',
  },
  emojiGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: 60,
    opacity: 0.2,
    zIndex: -1,
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
  quickStartCard: {
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.botBubble,
    borderColor: theme.colors.primaryLight,
    borderWidth: 2,
    alignItems: 'center',
  },
  quickStartTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  quickStartText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: theme.spacing.lg,
  },
  featuresTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  featureItem: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '48%',
    height: 120,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
    featureEmoji: {
    fontSize: 36,
    textAlign: 'center',
    marginBottom: 2,
  },
  featureText: {
    fontSize: 15,
    color: theme.colors.textLight,
    fontWeight: '400',
    textAlign: 'center',
  },
  encouragementCard: {
    backgroundColor: theme.colors.surfaceLight,
    borderColor: theme.colors.primaryLight,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  encouragementTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  encouragementText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingBottom: theme.spacing.lg,
  },
  button: {
    borderRadius: theme.borderRadius.xl,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default WelcomeScreen; 