import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import ProgressIndicator from '../../components/ProgressIndicator';
import AnimatedContainer from '../../components/AnimatedContainer';
import { theme } from '../../constants/theme';
import { OnboardingService } from '../../services/OnboardingService';

interface AvatarScreenProps {
  onNext: () => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

const AvatarScreen: React.FC<AvatarScreenProps> = ({ onNext, onBack, currentStep, totalSteps }) => {
  const [selectedColor, setSelectedColor] = useState('#87CEEB');
  const [selectedStyle, setSelectedStyle] = useState('friendly');
  const [selectedName, setSelectedName] = useState('Buddy');
  const [customName, setCustomName] = useState('');
  const [isCustomName, setIsCustomName] = useState(false);

  const avatarColors = [
    '#87CEEB', // Sky blue
    '#FFD700', // Gold
    '#98FB98', // Pale green
    '#DDA0DD', // Plum
    '#F0E68C', // Khaki
    '#FFA07A', // Light salmon
  ];

  const avatarStyles = [
    { id: 'friendly', emoji: '😊', name: 'Friendly' },
    { id: 'wise', emoji: '🤓', name: 'Wise' },
    { id: 'cheerful', emoji: '😄', name: 'Cheerful' },
    { id: 'calm', emoji: '😌', name: 'Calm' },
  ];

  const presetNames = ['Buddy', 'Helper', 'Friend', 'Pal'];

  const handlePresetNameSelect = (name: string) => {
    setSelectedName(name);
    setIsCustomName(false);
    setCustomName('');
  };

  const handleCustomNameChange = (text: string) => {
    setCustomName(text);
    setSelectedName(text);
    setIsCustomName(true);
  };

  const displayName = isCustomName ? customName : selectedName;

  const handleNext = async () => {
    try {
      // Save avatar configuration before proceeding
      await OnboardingService.updateAvatarConfig({
        color: selectedColor,
        style: selectedStyle,
        name: displayName,
      });
      onNext();
    } catch (error) {
      console.error('Failed to save avatar configuration:', error);
      // Still proceed to avoid blocking the user
      onNext();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <AnimatedContainer animationType="slideIn" duration={400} style={styles.content}>
          <AnimatedContainer animationType="fadeIn" delay={200} style={styles.header}>
            <Text style={styles.title} allowFontScaling={false}>Create Your Avatar 🎨</Text>
            <Text style={styles.subtitle}>
              Choose colors and style for your AI companion
            </Text>
          </AnimatedContainer>

          <AnimatedContainer animationType="scaleIn" delay={200}>
            <Card style={styles.previewCard}>
              <Text style={styles.sectionTitle}>Preview</Text>
              <View style={styles.avatarPreview}>
                <View style={[styles.avatarCircle, { backgroundColor: selectedColor }]}>
                  <Text style={styles.avatarEmoji} allowFontScaling={false}>
                    {avatarStyles.find(style => style.id === selectedStyle)?.emoji}
                  </Text>
                </View>
                <Text style={styles.avatarName}>{displayName || 'Your Avatar'}</Text>
              </View>
            </Card>
          </AnimatedContainer>

          <AnimatedContainer animationType="slideIn" delay={300}>
            <Card style={styles.customizationCard}>
              <Text style={styles.sectionTitle}>🎨 Pick a Color</Text>
              <View style={styles.colorGrid}>
                {avatarColors.map((color, index) => (
                  <AnimatedContainer key={color} animationType="scaleIn" delay={400 + index * 50}>
                    <TouchableOpacity
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        selectedColor === color && styles.selectedColor
                      ]}
                      onPress={() => setSelectedColor(color)}
                      accessibilityLabel={`Select ${color} color`}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: selectedColor === color }}
                    />
                  </AnimatedContainer>
                ))}
              </View>
            </Card>
          </AnimatedContainer>

          <AnimatedContainer animationType="slideIn" delay={500}>
            <Card style={styles.customizationCard}>
              <Text style={styles.sectionTitle}>😊 Choose Personality</Text>
              <View style={styles.styleGrid}>
                {avatarStyles.map((style, index) => (
                  <AnimatedContainer key={style.id} animationType="scaleIn" delay={600 + index * 75}>
                    <TouchableOpacity
                      style={[
                        styles.styleOption,
                        selectedStyle === style.id && styles.selectedStyle
                      ]}
                      onPress={() => setSelectedStyle(style.id)}
                      accessibilityLabel={`Select ${style.name} style`}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: selectedStyle === style.id }}
                    >
                      <Text style={styles.styleEmoji} allowFontScaling={false}>{style.emoji}</Text>
                      <Text style={styles.styleName}>{style.name}</Text>
                    </TouchableOpacity>
                  </AnimatedContainer>
                ))}
              </View>
            </Card>
          </AnimatedContainer>

          <AnimatedContainer animationType="slideIn" delay={700}>
            <Card style={styles.customizationCard}>
              <Text style={styles.sectionTitle}>✏️ Choose Name</Text>
              <View style={styles.nameGrid}>
                {presetNames.map((name, index) => (
                  <AnimatedContainer key={name} animationType="fadeIn" delay={800 + index * 50}>
                    <TouchableOpacity
                      style={[
                        styles.nameOption,
                        selectedName === name && !isCustomName && styles.selectedName
                      ]}
                      onPress={() => handlePresetNameSelect(name)}
                      accessibilityLabel={`Select ${name} as the name`}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: selectedName === name && !isCustomName }}
                    >
                      <Text style={[
                        styles.nameText,
                        selectedName === name && !isCustomName && styles.selectedNameText
                      ]}>
                        {name}
                      </Text>
                    </TouchableOpacity>
                  </AnimatedContainer>
                ))}
              </View>
              
              <AnimatedContainer animationType="fadeIn" delay={900}>
                <View style={styles.customNameContainer}>
                  <Text style={styles.customNameLabel}>Or type your own:</Text>
                  <Input
                    placeholder="Enter custom name"
                    value={customName}
                    onChangeText={handleCustomNameChange}
                    style={styles.customNameInput}
                  />
                </View>
              </AnimatedContainer>
            </Card>
          </AnimatedContainer>

          <AnimatedContainer animationType="fadeIn" delay={1000}>
            <Card style={styles.tipCard}>
              <Text style={styles.tipTitle}>💡 Tip</Text>
              <Text style={styles.tipText}>
                You can change everything later in settings!
              </Text>
            </Card>
          </AnimatedContainer>
        </AnimatedContainer>
      </ScrollView>

      <AnimatedContainer animationType="slideIn" delay={1100} style={styles.buttonContainer}>
        <Button
          title="Back"
          onPress={onBack}
          variant="outline"
          size="large"
          style={styles.backButton}
        />
        <Button
          title="Continue ✨"
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
    paddingTop: theme.spacing.sm,
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
  previewCard: {
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  avatarPreview: {
    alignItems: 'center',
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    borderWidth: 3,
    borderColor: theme.colors.background,
    ...theme.shadows.md,
  },
  avatarEmoji: {
    fontSize: 40,
  },
  avatarName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
  },
  customizationCard: {
    marginBottom: theme.spacing.md,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.sm,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: 'transparent',
    margin: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  selectedColor: {
    borderColor: theme.colors.text,
    borderWidth: 4,
  },
  styleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.sm,
  },
  styleOption: {
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    minWidth: 80,
    margin: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  selectedStyle: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },
  styleEmoji: {
    fontSize: 30,
    marginBottom: theme.spacing.xs,
  },
  styleName: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    textAlign: 'center',
    fontWeight: theme.typography.fontWeight.medium,
  },
  nameGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  nameOption: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    margin: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  selectedName: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },
  nameText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    textAlign: 'center',
  },
  selectedNameText: {
    fontWeight: theme.typography.fontWeight.bold,
  },
  customNameContainer: {
    alignItems: 'center',
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  customNameLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  customNameInput: {
    minWidth: 200,
    textAlign: 'center',
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

export default AvatarScreen; 