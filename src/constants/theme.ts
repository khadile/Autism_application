/**
 * BuddyBot Theme System
 * Comprehensive design system for accessibility-first autism support app
 */

export const colors = {
  // Primary Colors
  primary: '#87CEEB',      // Sky blue - main brand color
  primaryLight: '#B6E0F0', // Lighter sky blue for backgrounds
  primaryDark: '#5A9BD8',  // Darker sky blue for emphasis
  
  // Secondary Colors
  secondary: '#1E3A8A',    // Dark blue - main text color
  secondaryLight: '#3B82F6', // Medium blue for accents
  
  // Background Colors
  background: '#FFFFFF',   // White background
  surface: '#F8FAFC',      // Light gray for cards/surfaces
  surfaceLight: '#F1F5F9', // Very light gray for subtle backgrounds
  
  // Text Colors
  text: '#1E3A8A',         // Dark blue - primary text
  textLight: '#64748B',    // Gray - secondary text
  textMuted: '#94A3B8',    // Light gray - muted text
  
  // Semantic Colors
  success: '#10B981',      // Green - positive feedback
  warning: '#F59E0B',      // Amber - warnings
  error: '#F87171',        // Soft red - alerts (used sparingly)
  info: '#3B82F6',         // Blue - informational
  
  // Interactive Colors
  interactive: '#87CEEB',  // Sky blue for interactive elements
  interactiveHover: '#5A9BD8', // Darker blue for hover states
  interactivePressed: '#4A90E2', // Even darker for pressed states
  
  // Avatar Colors
  avatarBg: '#87CEEB',     // Sky blue background for avatars
  avatarAccent: '#FFD700', // Gold for avatar accessories
  
  // Accessibility Colors
  focus: '#2563EB',        // Blue for focus indicators
  disabled: '#CBD5E1',     // Gray for disabled states
  border: '#E2E8F0',       // Light gray for borders
  
  // Chat Colors
  botBubble: '#F0F8FF',    // Very light blue for bot messages
  userBubble: '#E0F2FE',   // Light blue for user messages
  
  // Activity Colors
  activityCard: '#FFFFFF', // White for activity cards
  activityIcon: '#87CEEB', // Sky blue for activity icons
} as const;

export const spacing = {
  // Base spacing unit (4px)
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  
  // Specific spacing for autism-friendly design
  touchTarget: 44,         // Minimum touch target size
  buttonPadding: 16,       // Padding inside buttons
  cardPadding: 20,         // Padding inside cards
  screenPadding: 20,       // Padding around screens
  
  // Spacing for specific components
  headerHeight: 60,        // Header height
  avatarSize: 100,         // Large avatar size
  avatarSmall: 60,         // Small avatar size
  iconSize: 24,            // Standard icon size
  iconLarge: 32,           // Large icon size
} as const;

export const typography = {
  // Font families
  fontFamily: {
    regular: 'System', // Use system font for best accessibility
    medium: 'System',
    bold: 'System',
  },
  
  // Font sizes - optimized for accessibility
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 40,
  },
  
  // Line heights for readability
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
  
  // Font weights
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999, // For circular elements
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
} as const;

export const accessibility = {
  // Minimum contrast ratios (WCAG 2.1 AA)
  contrastRatio: {
    normal: 4.5,
    large: 3.0,
  },
  
  // Minimum touch target sizes
  touchTarget: {
    minimum: 44,
    recommended: 48,
  },
  
  // Animation durations (can be disabled for reduced motion)
  animation: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  
  // Focus indicator styles
  focus: {
    width: 2,
    color: colors.focus,
    offset: 2,
  },
  
  // Screen reader labels
  labels: {
    loading: 'Loading',
    error: 'Error',
    success: 'Success',
    required: 'Required',
    optional: 'Optional',
  },
} as const;

// Autism-specific design considerations
export const autismDesign = {
  // Visual preferences
  highContrast: true,
  reducedMotion: false, // Can be overridden by user preference
  clearFocus: true,
  consistentLayout: true,
  
  // Interaction preferences
  immediateResponse: true,
  visualFeedback: true,
  audioFeedback: false, // Optional, user controlled
  hapticFeedback: true,
  
  // Cognitive load considerations
  oneTaskAtATime: true,
  clearNavigation: true,
  predictablePatterns: true,
  progressiveDisclosure: true,
  
  // Sensory considerations
  calmColors: true,
  minimalAnimations: true,
  gentleSounds: true,
  comfortableSpacing: true,
} as const;

// Default theme object
export const theme = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  accessibility,
  autismDesign,
} as const;

// Type definitions for TypeScript
export type Theme = typeof theme;
export type Colors = typeof colors;
export type Spacing = typeof spacing;
export type Typography = typeof typography;

export default theme; 