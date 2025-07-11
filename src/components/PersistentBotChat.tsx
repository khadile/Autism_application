import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { theme } from '../constants/theme';

interface PersistentBotChatProps {
  isVisible?: boolean;
  onSendMessage?: (message: string) => void;
  onVoicePress?: () => void;
}

const { height: screenHeight } = Dimensions.get('window');

const PersistentBotChat: React.FC<PersistentBotChatProps> = ({
  isVisible = true,
  onSendMessage,
  onVoicePress,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [expandedHeight] = useState(new Animated.Value(60)); // Minimized height

  const toggleExpanded = () => {
    const toValue = isExpanded ? 60 : 200; // Expand to 200px height
    
    Animated.timing(expandedHeight, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    
    setIsExpanded(!isExpanded);
  };

  const handleSend = () => {
    if (message.trim() && onSendMessage) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.container, { height: expandedHeight }]}>
      <View style={styles.content}>
        {/* Header */}
        <TouchableOpacity 
          style={styles.header} 
          onPress={toggleExpanded}
          accessibilityLabel={isExpanded ? "Minimize chat" : "Expand chat"}
          accessibilityRole="button"
        >
          <View style={styles.headerContent}>
            <Text style={styles.botIcon}>🤖</Text>
            <Text style={styles.headerText}>Chat with Buddy</Text>
            <Text style={styles.expandIcon}>
              {isExpanded ? '↓' : '↑'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Expanded Content */}
        {isExpanded && (
          <View style={styles.expandedContent}>
            {/* Bot Message */}
            <View style={styles.messageContainer}>
              <View style={styles.botMessage}>
                <Text style={styles.botIcon}>🤖</Text>
                <Text style={styles.botText}>
                  Need help choosing an activity? I can help!
                </Text>
              </View>
            </View>

            {/* Input Area */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={message}
                onChangeText={setMessage}
                placeholder="Type a message..."
                placeholderTextColor={theme.colors.textLight}
                multiline={false}
                accessibilityLabel="Type your message"
                accessibilityHint="Enter text to chat with Buddy"
              />
              <TouchableOpacity
                style={styles.voiceButton}
                onPress={onVoicePress}
                accessibilityLabel="Voice input"
                accessibilityRole="button"
              >
                <Text style={styles.voiceIcon}>🎤</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSend}
                disabled={!message.trim()}
                accessibilityLabel="Send message"
                accessibilityRole="button"
              >
                <Text style={styles.sendText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  content: {
    flex: 1,
  },
  header: {
    height: 60,
    paddingHorizontal: theme.spacing.md,
    justifyContent: 'center',
    borderTopLeftRadius: theme.borderRadius.md,
    borderTopRightRadius: theme.borderRadius.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botIcon: {
    fontSize: 20,
    marginRight: theme.spacing.sm,
  },
  headerText: {
    flex: 1,
    fontSize: theme.fonts.sizes.medium,
    fontWeight: '600',
    color: theme.colors.text,
  },
  expandIcon: {
    fontSize: 18,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  expandedContent: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  botMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  botText: {
    flex: 1,
    fontSize: theme.fonts.sizes.medium,
    color: theme.colors.text,
    marginLeft: theme.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    minHeight: 44, // Accessibility minimum touch target
  },
  textInput: {
    flex: 1,
    fontSize: theme.fonts.sizes.medium,
    color: theme.colors.text,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.xs,
  },
  voiceIcon: {
    fontSize: 16,
  },
  sendButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    marginLeft: theme.spacing.xs,
    minHeight: 44, // Accessibility minimum touch target
    justifyContent: 'center',
  },
  sendText: {
    color: theme.colors.background,
    fontSize: theme.fonts.sizes.medium,
    fontWeight: '600',
  },
});

export default PersistentBotChat; 