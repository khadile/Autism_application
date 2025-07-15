import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { theme } from '../../constants/theme';
import PersistentBotChat from '../../components/PersistentBotChat';

interface Activity {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  onPress: () => void;
}

const ActivitiesScreen: React.FC = () => {
  const activities: Activity[] = [
    {
      id: '1',
      title: 'Social',
      subtitle: 'Flashcards',
      icon: '📚',
      color: theme.colors.primary,
      onPress: () => console.log('Social Flashcards pressed'),
    },
    {
      id: '2',
      title: 'Role-Play',
      subtitle: 'Scenarios',
      icon: '🎭',
      color: '#FF6B6B',
      onPress: () => console.log('Role-Play pressed'),
    },
    {
      id: '3',
      title: 'Calm-Down',
      subtitle: 'Corner',
      icon: '🧘',
      color: '#4ECDC4',
      onPress: () => console.log('Calm-Down pressed'),
    },
    {
      id: '4',
      title: 'Social',
      subtitle: 'Stories',
      icon: '📖',
      color: '#45B7D1',
      onPress: () => console.log('Social Stories pressed'),
    },
    {
      id: '5',
      title: 'Mood',
      subtitle: 'Check-in',
      icon: '💭',
      color: '#96CEB4',
      onPress: () => console.log('Mood Check-in pressed'),
    },
    {
      id: '6',
      title: 'Progress',
      subtitle: 'Tracker',
      icon: '📊',
      color: '#FFEAA7',
      onPress: () => console.log('Progress pressed'),
    },
  ];

  const handleProfilePress = () => {
    console.log('Profile pressed');
  };

  const handleHomePress = () => {
    console.log('Home pressed');
  };

  const handleBotMessage = (message: string) => {
    console.log('Bot message:', message);
  };

  const handleVoicePress = () => {
    console.log('Voice pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={handleProfilePress}
          accessibilityLabel="Profile"
          accessibilityRole="button"
        >
          <Text style={styles.headerIcon} allowFontScaling={false}>👤</Text>
          <Text style={styles.headerButtonText}>Profile</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Activities</Text>
        
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={handleHomePress}
          accessibilityLabel="Home"
          accessibilityRole="button"
        >
          <Text style={styles.headerIcon} allowFontScaling={false}>🏠</Text>
          <Text style={styles.headerButtonText}>Home</Text>
        </TouchableOpacity>
      </View>

      {/* Activities Grid */}
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.activitiesContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.activitiesGrid}>
          {activities.map((activity) => (
            <TouchableOpacity
              key={activity.id}
              style={styles.activityCard}
              onPress={activity.onPress}
              accessibilityLabel={`${activity.title} ${activity.subtitle}`}
              accessibilityRole="button"
              accessibilityHint={`Open ${activity.title} ${activity.subtitle} activity`}
            >
              <View style={styles.activityContent}>
                <View style={[styles.activityIconContainer, { backgroundColor: activity.color }]}>
                  <Text style={styles.activityIcon} allowFontScaling={false}>{activity.icon}</Text>
                </View>
                
                <View style={styles.activityTextContainer}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activitySubtitle}>{activity.subtitle}</Text>
                </View>
                
                <View style={styles.playButtonContainer}>
                  <View style={styles.playButton}>
                    <Text style={styles.playButtonText}>Play</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Extra padding for persistent chat */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Persistent Bot Chat */}
      <PersistentBotChat
        isVisible={true}
        onSendMessage={handleBotMessage}
        onVoicePress={handleVoicePress}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerButton: {
    alignItems: 'center',
    minWidth: 60,
    minHeight: 44, // Accessibility minimum touch target
    justifyContent: 'center',
  },
  headerIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  headerButtonText: {
    fontSize: 12,
    color: theme.colors.text,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  activitiesContainer: {
    padding: theme.spacing.md,
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  activityCard: {
    width: '47%', // Two cards per row with spacing
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  activityContent: {
    padding: theme.spacing.md,
    alignItems: 'center',
    minHeight: 140,
  },
  activityIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  activityIcon: {
    fontSize: 28,
  },
  activityTextContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    flex: 1,
    justifyContent: 'center',
  },
  activityTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
  playButtonContainer: {
    width: '100%',
  },
  playButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    minHeight: 44, // Accessibility minimum touch target
    justifyContent: 'center',
  },
  playButtonText: {
    color: theme.colors.background,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  bottomPadding: {
    height: 80, // Space for persistent chat
  },
});

export default ActivitiesScreen; 