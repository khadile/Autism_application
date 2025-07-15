import React from 'react';
import { TextInput, View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../constants/theme';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  multiline?: boolean;
  secureTextEntry?: boolean;
  accessibilityLabel?: string;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
}

const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  disabled = false,
  multiline = false,
  secureTextEntry = false,
  accessibilityLabel,
  style,
  inputStyle,
  keyboardType = 'default',
}) => {
  const inputStyles = [
    styles.input,
    ...(error ? [styles.inputError] : []),
    ...(disabled ? [styles.inputDisabled] : []),
    ...(multiline ? [styles.inputMultiline] : []),
    ...(inputStyle ? [inputStyle] : []),
  ];

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label} allowFontScaling={false}>{label}</Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        editable={!disabled}
        multiline={multiline}
        secureTextEntry={secureTextEntry}
        style={inputStyles}
        placeholderTextColor={theme.colors.textMuted}
        accessibilityLabel={accessibilityLabel || label || placeholder}
        accessibilityHint={error ? `Error: ${error}` : undefined}
        keyboardType={keyboardType}
      />
      {error && (
        <Text style={styles.error} allowFontScaling={false}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  
  label: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.md,
  },
  
  input: {
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
    minHeight: theme.spacing.touchTarget,
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.md,
  },
  
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  
  inputError: {
    borderColor: theme.colors.error,
  },
  
  inputDisabled: {
    backgroundColor: theme.colors.disabled,
    color: theme.colors.textMuted,
  },
  
  error: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.sm,
  },
});

export default Input; 