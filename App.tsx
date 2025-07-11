import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import ActivitiesScreen from './src/screens/ActivitiesScreen';
import { theme } from './src/constants/theme';

// Create bottom tab navigator
const Tab = createBottomTabNavigator();

export default function App() {
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
            tabBarInactiveTintColor: theme.colors.textLight,
            tabBarStyle: {
              backgroundColor: theme.colors.background,
              borderTopColor: theme.colors.border,
              borderTopWidth: 1,
              height: 60,
              paddingBottom: 8,
              paddingTop: 8,
            },
            tabBarLabelStyle: {
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
            },
            headerShown: false, // We'll handle headers in individual screens
          })}
        >
          <Tab.Screen 
            name="Home" 
            component={HomeScreen}
            options={{
              title: 'Home',
              tabBarAccessibilityLabel: 'Home tab',
            }}
          />
          <Tab.Screen 
            name="Activities" 
            component={ActivitiesScreen}
            options={{
              title: 'Activities',
              tabBarAccessibilityLabel: 'Activities tab',
            }}
          />
          <Tab.Screen 
            name="Profile" 
            component={ProfileScreen}
            options={{
              title: 'Profile',
              tabBarAccessibilityLabel: 'Profile tab',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// Placeholder ProfileScreen component
const ProfileScreen = () => {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    }}>
      <Text style={{
        fontSize: theme.typography.fontSize.lg,
        color: theme.colors.text,
        fontWeight: theme.typography.fontWeight.medium,
      }}>
        Profile Screen
      </Text>
      <Text style={{
        fontSize: theme.typography.fontSize.md,
        color: theme.colors.textLight,
        marginTop: theme.spacing.sm,
      }}>
        Coming soon...
      </Text>
    </View>
  );
}; 