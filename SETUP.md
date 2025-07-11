# BuddyBot Setup Guide

This guide will help you set up the BuddyBot development environment and get the app running on your local machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js** (version 18 or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`

- **npm** or **yarn** (npm comes with Node.js)
  - Verify npm: `npm --version`
  - Or install yarn: `npm install -g yarn`

- **Git** for version control
  - Download from [git-scm.com](https://git-scm.com/)

### Development Tools

#### For iOS Development (macOS only)
- **Xcode** (latest version from App Store)
- **Xcode Command Line Tools**: `xcode-select --install`
- **iOS Simulator** (included with Xcode)

#### For Android Development
- **Android Studio** (download from [developer.android.com](https://developer.android.com/studio))
- **Android SDK** (installed with Android Studio)
- **Android Virtual Device (AVD)** for testing

### Expo CLI
Install Expo CLI globally:
```bash
npm install -g expo-cli
```

## 🚀 Project Setup

### 1. Initialize the Project

Since this is a fresh project scaffold, you'll need to initialize it properly:

```bash
# Create a new Expo project
npx create-expo-app BuddyBot --template blank-typescript

# Navigate to the project directory
cd BuddyBot

# Copy the scaffolded files from this repository
# (Copy all files from the scaffold to your new project)
```

### 2. Install Dependencies

Install all required dependencies:

```bash
npm install
```

### 3. Install Additional Dependencies

Install the specific packages required for BuddyBot:

```bash
# Navigation
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs

# React Native specific navigation dependencies
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler

# UI and Animation
npm install react-native-reanimated react-native-svg lottie-react-native
npx expo install expo-linear-gradient expo-haptics

# Audio and Speech
npx expo install expo-av expo-speech

# Storage
npx expo install expo-sqlite expo-secure-store @react-native-async-storage/async-storage

# Icons and Fonts
npm install react-native-vector-icons
npx expo install expo-font

# Other utilities
npx expo install expo-constants expo-linking expo-splash-screen
```

### 4. Configure Metro (Optional)

If you encounter any bundling issues, create a `metro.config.js` file:

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = config;
```

### 5. Start the Development Server

```bash
npm start
```

This will start the Expo development server and show you a QR code.

### 6. Run on Device/Simulator

#### iOS (macOS only)
```bash
npm run ios
```

#### Android
```bash
npm run android
```

#### Web (for testing)
```bash
npm run web
```

## 📱 Development Workflow

### Running the App

1. **Start the development server**: `npm start`
2. **Choose your platform**:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser
   - Scan QR code with Expo Go app on your phone

### Code Structure

The project follows this structure:
```
src/
├── components/          # Reusable UI components
├── screens/            # App screens (Welcome, Home, etc.)
├── services/           # Business logic and API calls
├── constants/          # Theme, colors, and constants
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

### Development Guidelines

1. **Follow the design system** defined in `src/constants/theme.ts`
2. **Maintain accessibility** - all components should be accessible
3. **Use TypeScript** - ensure type safety throughout the app
4. **Test on real devices** - especially for accessibility features
5. **Follow the coding standards** defined in `.cursorrules`

## 🛠️ Troubleshooting

### Common Issues

#### 1. Metro bundler issues
```bash
# Clear Metro cache
npx expo start --clear
```

#### 2. iOS simulator not starting
- Make sure Xcode is properly installed
- Open Xcode and agree to license terms
- Check that iOS simulator is available

#### 3. Android emulator issues
- Ensure Android Studio is properly configured
- Create an AVD (Android Virtual Device)
- Check that ANDROID_HOME environment variable is set

#### 4. Module not found errors
```bash
# Clear node modules and reinstall
rm -rf node_modules
npm install
```

#### 5. TypeScript errors
- Make sure all required types are installed
- Check `tsconfig.json` configuration
- Restart TypeScript language server in your IDE

### Environment Variables

Create a `.env` file in the root directory for environment-specific configuration:

```env
# Development environment
NODE_ENV=development

# API endpoints (when needed)
API_BASE_URL=https://api.buddybot.com

# Feature flags
ENABLE_VOICE_FEATURES=true
ENABLE_CLOUD_SYNC=false
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Testing Guidelines

1. **Unit tests** for utilities and services
2. **Integration tests** for user flows
3. **Accessibility tests** for all components
4. **Manual testing** on real devices

### Accessibility Testing

1. **Enable screen reader** (VoiceOver on iOS, TalkBack on Android)
2. **Test keyboard navigation** (if applicable)
3. **Check color contrast** ratios
4. **Test with large fonts** and high contrast modes

## 📚 Additional Resources

### Documentation
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Accessibility Guidelines](https://reactnative.dev/docs/accessibility)

### BuddyBot Specific
- [Project Documentation](./docs/)
- [Design System](./src/constants/theme.ts)
- [Development Guidelines](./.cursorrules)

## 🆘 Getting Help

If you encounter issues:

1. Check the [troubleshooting section](#troubleshooting)
2. Review the [documentation](./docs/)
3. Check existing issues in the repository
4. Create a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Your environment details
   - Screenshots (if applicable)

## 🎯 Next Steps

After successful setup:

1. **Explore the documentation** in the `docs/` folder
2. **Review the wireframes** and user flows
3. **Start with the onboarding flow** implementation
4. **Focus on accessibility** from the beginning
5. **Test early and often** with real devices

---

**Happy coding! 🚀**

Remember: We're building technology that supports and empowers the autism community. Every feature should be designed with accessibility, clarity, and user empowerment in mind. 