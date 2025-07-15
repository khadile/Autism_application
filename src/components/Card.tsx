import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../constants/theme';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  shadow?: boolean;
  padding?: 'small' | 'medium' | 'large';
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  style,
  titleStyle,
  subtitleStyle,
  shadow = true,
  padding = 'medium',
}) => {
  const cardStyle = [
    styles.base,
    styles[padding],
    shadow && styles.shadow,
    style,
  ];

  return (
    <View style={cardStyle}>
      {title && (
        <Text style={[styles.title, titleStyle]} allowFontScaling={false}>{title}</Text>
      )}
      {subtitle && (
        <Text style={[styles.subtitle, subtitleStyle]} allowFontScaling={false}>{subtitle}</Text>
      )}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  
  // Padding variants
  small: {
    padding: theme.spacing.md,
  },
  medium: {
    padding: theme.spacing.lg,
  },
  large: {
    padding: theme.spacing.xl,
  },
  
  // Shadow
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  
  // Typography
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.lg,
  },
  
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.sm,
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.md,
  },
});

export default Card; 