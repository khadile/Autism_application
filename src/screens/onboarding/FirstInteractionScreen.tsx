import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import ProgressIndicator from '../../components/ProgressIndicator';
import AnimatedContainer from '../../components/AnimatedContainer';
import { theme } from '../../constants/theme';
import { OnboardingService } from '../../services/OnboardingService';

interface FirstInteractionScreenProps {
  onNext: () => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

type ConversationStep = {
  id: string;
  botMessage: string;
  userOptions?: string[];
  hasNameInput?: boolean;
  nextStep?: string;
};

const conversationFlow: { [key: string]: ConversationStep } = {
  greeting: {
    id: 'greeting',
    botMessage: "Hi there! I'm so excited to meet you! 🎉 I'm your AI companion, and I'm here to help you practice social skills. What should I call you?",
    hasNameInput: true,
    userOptions: ["My name is Alex", "I'm Sam", "Call me Jamie"],
    nextStep: 'introduction',
  },
  introduction: {
    id: 'introduction',
    botMessage: "Nice to meet you! I love that name! 😊 I'm here to chat, practice conversations, and try fun activities with you. How are you feeling?",
    userOptions: ["I'm excited!", "A little nervous", "I'm ready to learn"],
    nextStep: 'encouragement',
  },
  encouragement: {
    id: 'encouragement',
    botMessage: "That's totally normal! Everyone learns at their own pace. I'm here to support you no matter what. What sounds fun to try?",
    userOptions: ["Practice talking", "Learn about emotions", "Try activities", "Just chat"],
    nextStep: 'complete',
  },
  complete: {
    id: 'complete',
    botMessage: "Great choice! Remember, there's no wrong way to learn. I'm here to help you every step of the way. Ready to start? 🚀",
    userOptions: ["Yes, let's do it!", "I'm ready to start"],
  },
};

const FirstInteractionScreen: React.FC<FirstInteractionScreenProps> = ({
  onNext,
  onBack,
  currentStep,
  totalSteps,
}) => {
  const [conversationStep, setConversationStep] = useState<string>('greeting');
  const [selectedResponse, setSelectedResponse] = useState<string>('');
  const [customName, setCustomName] = useState<string>('');
  const [conversationHistory, setConversationHistory] = useState<
    Array<{ type: 'bot' | 'user'; message: string }>
  >([]);

  const currentConversation = conversationFlow[conversationStep];

  const handleUserResponse = (response: string) => {
    setSelectedResponse(response);
    
    // Add user response to history
    const newHistory = [
      ...conversationHistory,
      { type: 'bot' as const, message: currentConversation.botMessage },
      { type: 'user' as const, message: response },
    ];
    setConversationHistory(newHistory);

    // Move to next step or complete
    if (currentConversation.nextStep) {
      setTimeout(() => {
        setConversationStep(currentConversation.nextStep!);
        setSelectedResponse('');
      }, 1000);
    } else {
      // Conversation is complete
      setTimeout(() => {
        handleNext();
      }, 1500);
    }
  };

  const handleNameSubmit = () => {
    if (customName.trim()) {
      handleUserResponse(`My name is ${customName}`);
    }
  };

  const canContinue = conversationStep === 'complete' && selectedResponse;

  const handleNext = async () => {
    try {
      // Save user name if provided before proceeding
      if (customName.trim()) {
        await OnboardingService.updateUserName(customName.trim());
      }
      onNext();
    } catch (error) {
      console.error('Failed to save user name:', error);
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
              <Text style={styles.title} allowFontScaling={false}>Meet Your AI Companion 🤖</Text>
              <Text style={styles.subtitle}>
                Let's have your first conversation! Choose responses that feel right.
              </Text>
            </View>
          </AnimatedContainer>

          <AnimatedContainer animationType="scaleIn" delay={300}>
            <Card style={styles.chatCard}>
            <View style={styles.chatContainer}>
              {/* Show conversation history */}
              {conversationHistory.map((message, index) => (
                <View
                  key={index}
                  style={[
                    styles.messageContainer,
                    message.type === 'bot' ? styles.botMessageContainer : styles.userMessageContainer,
                  ]}
                >
                  {message.type === 'bot' && (
                    <Text style={styles.botIcon} allowFontScaling={false}>🤖</Text>
                  )}
                  <View
                    style={[
                      styles.messageBubble,
                      message.type === 'bot' ? styles.botBubble : styles.userBubble,
                    ]}
                  >
                    <Text style={styles.messageText}>{message.message}</Text>
                  </View>
                </View>
              ))}

              {/* Current bot message */}
              <View style={styles.messageContainer}>
                <Text style={styles.botIcon} allowFontScaling={false}>🤖</Text>
                <View style={styles.messageBubble}>
                  <Text style={styles.messageText}>{currentConversation.botMessage}</Text>
                </View>
              </View>
            </View>
          </Card>
          </AnimatedContainer>

          {/* Name input for greeting step */}
          {currentConversation.hasNameInput && (
            <Card style={styles.nameInputCard}>
              <Text style={styles.nameInputTitle}>Type your name:</Text>
              <Input
                placeholder="Enter your name"
                value={customName}
                onChangeText={setCustomName}
                style={styles.nameInput}
              />
              <Button
                title="Submit"
                onPress={handleNameSubmit}
                size="medium"
                style={styles.nameSubmitButton}
                disabled={!customName.trim()}
              />
            </Card>
          )}

          {/* User response options */}
          {currentConversation.userOptions && (
            <View style={styles.responseContainer}>
              <Text style={styles.responseTitle}>Or choose:</Text>
              <View style={styles.responseOptions}>
                {currentConversation.userOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.responseOption,
                      selectedResponse === option && styles.selectedResponse,
                    ]}
                    onPress={() => handleUserResponse(option)}
                    disabled={selectedResponse !== ''}
                    accessibilityLabel={`Response option: ${option}`}
                    accessibilityRole="button"
                  >
                    <Text style={[
                      styles.responseText,
                      selectedResponse === option && styles.selectedResponseText,
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {conversationStep === 'greeting' && (
            <Card style={styles.tipCard}>
              <Text style={styles.tipTitle}>💡 Tip</Text>
              <Text style={styles.tipText}>
                There's no wrong answer! Choose whatever feels comfortable.
              </Text>
            </Card>
          )}
        </AnimatedContainer>
      </ScrollView>

      <AnimatedContainer animationType="slideIn" delay={500} style={styles.buttonContainer}>
        <Button
          title="Back"
          onPress={onBack}
          variant="outline"
          size="large"
          style={styles.backButton}
        />
        <Button
          title={canContinue ? "Start Using BuddyBot!" : "Continue"}
          onPress={canContinue ? handleNext : () => {}}
          size="large"
          style={styles.nextButton}
          disabled={!canContinue && conversationStep !== 'complete'}
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
  },
  chatCard: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
  },
  chatContainer: {
    minHeight: 180,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  botMessageContainer: {
    justifyContent: 'flex-start',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
    flexDirection: 'row-reverse',
  },
  botIcon: {
    fontSize: 20,
    marginRight: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  messageBubble: {
    maxWidth: '80%',
    backgroundColor: theme.colors.botBubble,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  botBubble: {
    backgroundColor: theme.colors.botBubble,
    borderColor: theme.colors.primary,
  },
  userBubble: {
    backgroundColor: theme.colors.userBubble,
    borderColor: theme.colors.secondary,
  },
  messageText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  nameInputCard: {
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
    borderWidth: 1,
  },
  nameInputTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  nameInput: {
    minWidth: 200,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  nameSubmitButton: {
    minWidth: 120,
  },
  responseContainer: {
    marginBottom: theme.spacing.lg,
  },
  responseTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  responseOptions: {
    gap: theme.spacing.sm,
  },
  responseOption: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  selectedResponse: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  responseText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    textAlign: 'center',
  },
  selectedResponseText: {
    fontWeight: theme.typography.fontWeight.medium,
  },
  tipCard: {
    backgroundColor: theme.colors.surfaceLight,
    borderColor: theme.colors.secondary,
    borderWidth: 1,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  tipTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  tipText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    textAlign: 'center',
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

export default FirstInteractionScreen; 