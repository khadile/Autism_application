import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

// Import screens
import { HomeScreen } from './src/screens/home';
import { ActivitiesScreen } from './src/screens/activities';
import { OnboardingNavigator } from './src/screens/onboarding';
import { OnboardingService } from './src/services/OnboardingService';
import { theme } from './src/constants/theme';

// Create bottom tab navigator
const Tab = createBottomTabNavigator();

export default function App() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      // Clear AsyncStorage to remove any old data that might cause fontSize errors
      await OnboardingService.resetOnboarding();
      
      const isComplete = await OnboardingService.isOnboardingComplete();
      setIsOnboardingComplete(isComplete);
    } catch (error) {
      console.error('Failed to check onboarding status:', error);
      // Default to showing onboarding if we can't check
      setIsOnboardingComplete(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = async () => {
    try {
      // Small delay to ensure all onboarding components are properly unmounted
      await new Promise(resolve => setTimeout(resolve, 100));
      setIsOnboardingComplete(true);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setIsOnboardingComplete(true); // Still proceed to avoid getting stuck
    }
  };

  if (isLoading) {
    // Show loading screen while checking onboarding status
    return (
      <SafeAreaProvider>
        <StatusBar style="dark" backgroundColor={theme.colors.background} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
          <Text style={{ fontSize: 18, color: theme.colors.text }} allowFontScaling={false}>Loading...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  if (!isOnboardingComplete) {
    return (
      <SafeAreaProvider>
        <StatusBar style="dark" backgroundColor={theme.colors.background} />
        <OnboardingNavigator onComplete={handleOnboardingComplete} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" backgroundColor={theme.colors.background} />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Activities') {
                iconName = focused ? 'game-controller' : 'game-controller-outline';
              } else if (route.name === 'Profile') {
                iconName = focused ? 'person' : 'person-outline';
              } else {
                iconName = 'help-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: theme.colors.textMuted,
            tabBarStyle: {
              backgroundColor: theme.colors.background,
              borderTopColor: theme.colors.border,
              paddingBottom: 8,
              paddingTop: 8,
              height: 70,
            },
            tabBarLabelStyle: {
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
            },
            headerShown: false,
          })}
        >
          <Tab.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{
              tabBarLabel: 'Home',
            }}
          />
          <Tab.Screen 
            name="Activities" 
            component={ActivitiesScreen} 
            options={{
              tabBarLabel: 'Activities',
            }}
          />
          <Tab.Screen 
            name="Profile" 
            component={ProfileScreen} 
            options={{
              tabBarLabel: 'Profile',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const ProfileScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
      <Text style={{
        fontSize: theme.typography.fontSize.lg,
        color: theme.colors.text,
        fontWeight: theme.typography.fontWeight.medium
      }} allowFontScaling={false}>
        Profile Screen
      </Text>
      <Text style={{
        fontSize: theme.typography.fontSize.md,
        color: theme.colors.textLight,
        marginTop: 8
      }} allowFontScaling={false}>
        Coming soon...
      </Text>
    </View>
  );
}; 