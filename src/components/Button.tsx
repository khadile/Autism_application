import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, Animated } from 'react-native';
import { theme } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  accessibilityLabel,
  style,
  textStyle,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style,
  ];

  const textStyleCombined = [
    styles.baseText,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  const animatedStyle = {
    transform: [{ scale: scaleAnim }],
    opacity: opacityAnim,
  };

  return (
    <Animated.View style={animatedStyle}>
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
        activeOpacity={1}
    >
        <Text style={textStyleCombined} allowFontScaling={false}>{title}</Text>
    </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.xl,
    minHeight: theme.spacing.touchTarget,
    paddingHorizontal: theme.spacing.buttonPadding,
    paddingVertical: theme.spacing.sm,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  
  // Variants
  primary: {
    backgroundColor: theme.colors.primary,
    borderWidth: 0,
    shadowColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
    borderWidth: 0,
    shadowColor: theme.colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.1,
  },
  
  // Sizes
  small: {
    minHeight: 36,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.lg,
  },
  medium: {
    minHeight: theme.spacing.touchTarget,
    paddingHorizontal: theme.spacing.buttonPadding,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.xl,
  },
  large: {
    minHeight: 56,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.xxl,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  
  // Disabled state
  disabled: {
    backgroundColor: theme.colors.disabled,
    borderColor: theme.colors.disabled,
    shadowOpacity: 0,
    elevation: 0,
  },
  
  // Text styles
  baseText: {
    fontWeight: theme.typography.fontWeight.bold,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  
  // Text variants
  primaryText: {
    color: theme.colors.background,
  },
  secondaryText: {
    color: theme.colors.background,
  },
  outlineText: {
    color: theme.colors.primary,
  },
  
  // Text sizes
  smallText: {
    fontSize: theme.typography.fontSize.sm,
    lineHeight: theme.typography.lineHeight.tight * theme.typography.fontSize.sm,
  },
  mediumText: {
    fontSize: theme.typography.fontSize.md,
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.md,
  },
  largeText: {
    fontSize: theme.typography.fontSize.lg,
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.lg,
  },
  
  // Disabled text
  disabledText: {
    color: theme.colors.textMuted,
  },
});

export default Button; 