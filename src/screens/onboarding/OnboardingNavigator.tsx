import React, { useState } from 'react';
import WelcomeScreen from './WelcomeScreen';
import AvatarScreen from './AvatarScreen';
import GoalSettingScreen from './GoalSettingScreen';
import AccessibilityPreferencesScreen from './AccessibilityPreferencesScreen';
import FirstInteractionScreen from './FirstInteractionScreen';
import { OnboardingService } from '../../services/OnboardingService';

interface OnboardingNavigatorProps {
  onComplete: () => void;
}

const OnboardingNavigator: React.FC<OnboardingNavigatorProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 5;

  const nextStep = async () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save onboarding completion status
      try {
        await OnboardingService.completeOnboarding();
        onComplete();
      } catch (error) {
        console.error('Failed to complete onboarding:', error);
        // Still proceed to avoid blocking the user
        onComplete();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderCurrentScreen = () => {
    switch (currentStep) {
      case 0:
        return (
          <WelcomeScreen 
            onNext={nextStep} 
            currentStep={currentStep} 
            totalSteps={totalSteps} 
          />
        );
      case 1:
        return (
          <AvatarScreen 
            onNext={nextStep} 
            onBack={prevStep} 
            currentStep={currentStep} 
            totalSteps={totalSteps} 
          />
        );
      case 2:
        return (
          <GoalSettingScreen 
            onNext={nextStep} 
            onBack={prevStep} 
            currentStep={currentStep} 
            totalSteps={totalSteps} 
          />
        );
      case 3:
        return (
          <AccessibilityPreferencesScreen 
            onNext={nextStep} 
            onBack={prevStep} 
            currentStep={currentStep} 
            totalSteps={totalSteps} 
          />
        );
      case 4:
        return (
          <FirstInteractionScreen 
            onNext={nextStep} 
            onBack={prevStep} 
            currentStep={currentStep} 
            totalSteps={totalSteps} 
          />
        );
      default:
        return (
          <WelcomeScreen 
            onNext={nextStep} 
            currentStep={currentStep} 
            totalSteps={totalSteps} 
          />
        );
    }
  };

  return renderCurrentScreen();
};

export default OnboardingNavigator; 