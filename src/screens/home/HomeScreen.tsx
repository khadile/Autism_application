import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

const HomeScreen = () => {
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  const [showChatInput, setShowChatInput] = useState(false);
  const [botMessage, setBotMessage] = useState("Hi Alex! 👋 How can I help you today?");

  // Bot suggestion options that lead the conversation
  const botSuggestions = [
    {
      id: 'feelings',
      text: 'Talk about feelings',
      icon: '😊',
      response: "That's wonderful! How are you feeling right now? Let's explore that together."
    },
    {
      id: 'social',
      text: 'Practice social skills',
      icon: '👥',
      response: "Great choice! Let's work on some social situations. What would you like to practice?"
    },
    {
      id: 'calm',
      text: 'Need to calm down',
      icon: '🧘',
      response: "I'm here to help you feel better. Let's try some calming techniques together."
    },
    {
      id: 'activities',
      text: 'Fun activities',
      icon: '🎮',
      response: "Perfect! I have some great activities planned for you. What sounds fun today?"
    }
  ];

  const handleSuggestionPress = (suggestion: typeof botSuggestions[0]) => {
    setSelectedSuggestion(suggestion.id);
    setBotMessage(suggestion.response);
    // Here you would typically trigger the relevant screen or activity
  };

  const handleChatToggle = () => {
    setShowChatInput(!showChatInput);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle" size={28} color="#1E3A8A" />
          <Text style={styles.headerText}>Profile</Text>
        </TouchableOpacity>
        
        <Text style={styles.welcomeText}>Welcome Alex!</Text>
        
        <TouchableOpacity style={styles.activitiesButton}>
          <Ionicons name="game-controller" size={28} color="#1E3A8A" />
          <Text style={styles.headerText}>Activities</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.chatContainer} showsVerticalScrollIndicator={false}>
        {/* Bot Avatar Section */}
        <View style={styles.botAvatarSection}>
          <TouchableOpacity style={styles.customizeAvatarButton}>
            <View style={styles.botAvatar}>
              <Text style={styles.botAvatarEmoji} allowFontScaling={false}>🤖</Text>
            </View>
            <Text style={styles.customizeText}>Tap to customize</Text>
          </TouchableOpacity>
          
          <View style={styles.botNameContainer}>
            <Text style={styles.botName}>BuddyBot</Text>
            <Text style={styles.botRole}>Your AI Companion</Text>
          </View>
        </View>

        {/* Bot Message Bubble */}
        <View style={styles.messageContainer}>
          <View style={styles.botMessageBubble}>
            <Text style={styles.botMessageText}>{botMessage}</Text>
          </View>
        </View>

        {/* Suggestion Buttons */}
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>What would you like to do?</Text>
          <View style={styles.suggestionsGrid}>
            {botSuggestions.map((suggestion) => (
              <TouchableOpacity
                key={suggestion.id}
                style={[
                  styles.suggestionButton,
                  selectedSuggestion === suggestion.id && styles.selectedSuggestion
                ]}
                onPress={() => handleSuggestionPress(suggestion)}
                accessibilityLabel={`${suggestion.text} activity`}
                accessibilityHint="Double tap to select this activity"
              >
                <Text style={styles.suggestionIcon} allowFontScaling={false}>{suggestion.icon}</Text>
                <Text style={styles.suggestionText}>{suggestion.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Chat Options */}
        <View style={styles.chatOptionsContainer}>
          <TouchableOpacity
            style={styles.chatToggleButton}
            onPress={handleChatToggle}
            accessibilityLabel="Toggle chat input"
          >
            <Ionicons 
              name={showChatInput ? "chatbubble" : "chatbubble-outline"} 
              size={24} 
              color="#87CEEB" 
            />
            <Text style={styles.chatToggleText}>
              {showChatInput ? "Hide Chat" : "Open Chat"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Chat Input (shown when toggled) */}
        {showChatInput && (
          <View style={styles.chatInputContainer}>
            <View style={styles.chatInputWrapper}>
              <TouchableOpacity style={styles.chatInput}>
                <Text style={styles.chatInputPlaceholder}>Type a message...</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.voiceButton}
                accessibilityLabel="Voice input"
              >
                <Ionicons name="mic" size={24} color="#87CEEB" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.screenPadding,
    paddingVertical: theme.spacing.md,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  profileButton: {
    alignItems: 'center',
    minWidth: 80,
    minHeight: theme.spacing.touchTarget,
  },
  activitiesButton: {
    alignItems: 'center',
    minWidth: 80,
    minHeight: theme.spacing.touchTarget,
  },
  headerText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  welcomeText: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    textAlign: 'center',
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.screenPadding,
  },
  botAvatarSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  customizeAvatarButton: {
    alignItems: 'center',
    minHeight: theme.spacing.touchTarget,
  },
  botAvatar: {
    width: theme.spacing.avatarSize,
    height: theme.spacing.avatarSize,
    borderRadius: theme.spacing.avatarSize / 2,
    backgroundColor: theme.colors.avatarBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    ...theme.shadows.md,
  },
  botAvatarEmoji: {
    fontSize: 40,
  },
  customizeText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
  },
  botNameContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  botName: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  botRole: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  },
  messageContainer: {
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  botMessageBubble: {
    backgroundColor: theme.colors.botBubble,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    ...theme.shadows.sm,
  },
  botMessageText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: theme.typography.fontSize.lg * theme.typography.lineHeight.relaxed,
  },
  suggestionsContainer: {
    marginVertical: theme.spacing.lg,
  },
  suggestionsTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  suggestionButton: {
    width: '48%',
    backgroundColor: theme.colors.activityCard,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
    minHeight: 100,
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  selectedSuggestion: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },
  suggestionIcon: {
    fontSize: theme.typography.fontSize.xxl,
    marginBottom: theme.spacing.sm,
  },
  suggestionText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: theme.typography.fontSize.sm * theme.typography.lineHeight.normal,
  },
  chatOptionsContainer: {
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  chatToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.botBubble,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    minHeight: theme.spacing.touchTarget,
  },
  chatToggleText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
  chatInputContainer: {
    marginBottom: theme.spacing.lg,
  },
  chatInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: theme.spacing.touchTarget,
  },
  chatInput: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  chatInputPlaceholder: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textMuted,
  },
  voiceButton: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
    minWidth: theme.spacing.touchTarget,
    minHeight: theme.spacing.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen; 