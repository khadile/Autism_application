import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

interface AnimatedContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  animationType?: 'fadeIn' | 'slideIn' | 'scaleIn';
  duration?: number;
  delay?: number;
}

const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  style,
  animationType = 'fadeIn',
  duration = 800,
  delay = 0,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    const animations = [];

    switch (animationType) {
      case 'fadeIn':
        animations.push(
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration,
            delay,
            useNativeDriver: true,
          })
        );
        break;
      
      case 'slideIn':
        animations.push(
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
              toValue: 0,
              duration,
              delay,
              useNativeDriver: true,
            }),
          ])
        );
        break;
      
      case 'scaleIn':
        animations.push(
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration,
              delay,
              useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
              toValue: 1,
              tension: 100,
              friction: 8,
              delay,
              useNativeDriver: true,
            }),
          ])
        );
        break;
    }

    Animated.sequence(animations).start();
  }, [animationType, duration, delay, fadeAnim, slideAnim, scaleAnim]);

  const getAnimatedStyle = () => {
    const baseStyle = {
      opacity: fadeAnim,
    };

    switch (animationType) {
      case 'slideIn':
        return {
          ...baseStyle,
          transform: [
            {
              translateY: slideAnim,
            },
          ],
        };
      
      case 'scaleIn':
        return {
          ...baseStyle,
          transform: [
            {
              scale: scaleAnim,
            },
          ],
        };
      
      default:
        return baseStyle;
    }
  };

  return (
    <Animated.View style={[style, getAnimatedStyle()]}>
      {children}
    </Animated.View>
  );
};

export default AnimatedContainer; 