import { FontSize } from '../types';

/**
 * Safely converts FontSize string values to numeric values for React Native styles
 * @param size FontSize string value
 * @returns numeric fontSize value
 */
export const convertFontSizeToNumber = (size: FontSize | undefined): number => {
  const sizeMap: Record<FontSize, number> = {
    'small': 14,
    'medium': 16,
    'large': 18,
    'extra-large': 20,
  };
  
  if (size && size in sizeMap) {
    return sizeMap[size];
  }
  
  console.warn('Invalid fontSize value:', size, 'defaulting to medium (16)');
  return 16; // Default to medium size
};

/**
 * Safely gets a fontSize value from accessibility settings
 * @param fontSize FontSize from accessibility settings
 * @returns numeric fontSize value safe for React Native styles
 */
export const getSafeFontSize = (fontSize?: FontSize): number => {
  return convertFontSizeToNumber(fontSize);
}; 