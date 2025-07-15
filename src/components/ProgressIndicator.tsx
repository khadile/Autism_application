import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { theme } from '../constants/theme';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  style?: any;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  style,
}) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const dotsAnim = useRef(
    Array.from({ length: totalSteps }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Animate progress bar to current progress
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 600,
      useNativeDriver: false,
    }).start();

    // Animate dots with staggered effect
    dotsAnim.forEach((anim, index) => {
      const delay = index * 100;
      const scale = index <= currentStep ? 1 : 0.6;
      
      Animated.timing(anim, {
        toValue: scale,
        duration: 400,
        delay,
        useNativeDriver: true,
      }).start();
    });
  }, [currentStep, progress, progressAnim, dotsAnim]);

  return (
    <View style={[styles.container, style]}>
      {/* Animated dots */}
      <View style={styles.dotsContainer}>
        {Array.from({ length: totalSteps }, (_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              index <= currentStep ? styles.activeDot : styles.inactiveDot,
              {
                transform: [{ scale: dotsAnim[index] }],
              },
            ]}
          >
            {index <= currentStep && (
              <View style={styles.dotInner} />
            )}
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 25,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  activeDot: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.3,
  },
  inactiveDot: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
  },
  dotInner: {
    width: 8,
    height: 8,
    borderRadius: 10,
    backgroundColor: theme.colors.background,
  },
});

export default ProgressIndicator; 