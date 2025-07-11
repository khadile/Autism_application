# BuddyBot - Autism Support App

BuddyBot is an AI-powered companion app designed to help autistic children and young adults (ages 6-24) navigate social situations, develop self-regulation skills, and build confidence through engaging, gamified activities.

## 🎯 Project Overview

BuddyBot provides:
- **AI Companion**: Supportive conversations and activity suggestions
- **Social Skills Training**: Flashcards, role-playing, and social stories
- **Self-Regulation Tools**: Breathing exercises, calm-down corner, mindfulness
- **Progress Tracking**: Badges, streaks, and skill development visualization
- **Avatar Customization**: Personalized companion with unlockable items
- **Accessibility-First Design**: WCAG 2.1 AA compliance for inclusive access

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (macOS) or Android Studio

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd buddybot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web (for testing)
   npm run web
   ```

## 📁 Project Structure

```
buddybot/
├── docs/                          # Complete documentation
│   ├── PRD.md                    # Product Requirements Document
│   ├── User-Flow-Diagram.md     # User journey and navigation
│   ├── Wireframes.md             # Text-based screen layouts
│   ├── Content-Map.md            # Activities and educational content
│   ├── Gamification-System.md   # Badges, rewards, and motivation
│   ├── Accessibility-Checklist.md # Autism-focused accessibility
│   ├── API-Data-Flow.md          # Architecture and data flow
│   └── Development-Tasks.md      # Implementation roadmap
├── src/                          # Source code
│   ├── components/               # Reusable UI components
│   ├── screens/                  # Main app screens
│   ├── services/                 # Business logic and data
│   ├── constants/                # Theme, colors, and constants
│   ├── hooks/                    # Custom React hooks
│   ├── types/                    # TypeScript type definitions
│   └── utils/                    # Utility functions
├── assets/                       # Images, icons, and animations
├── .cursorrules                  # Development guidelines
├── package.json                  # Dependencies and scripts
└── app.json                      # Expo configuration
```

## 🎨 Design System

### Color Palette
- **Primary**: Sky Blue (#87CEEB) - Calming and approachable
- **Secondary**: Dark Blue (#1E3A8A) - Readable text and accents
- **Background**: White (#FFFFFF) - Clean and uncluttered
- **Success**: Green (#10B981) - Positive feedback
- **Warning**: Orange (#F59E0B) - Gentle alerts

### Accessibility Features
- High contrast ratios (4.5:1 minimum)
- Large touch targets (44x44dp minimum)
- Screen reader support
- Keyboard navigation
- Reduced motion options
- Font size scaling
- Voice input/output support

## 📱 Key Features

### 1. AI Companion
- Natural conversation interface
- Mood detection and appropriate responses
- Activity suggestions based on user state
- Age-appropriate language and content
- Emotional support and encouragement

### 2. Activities
- **Social Flashcards**: Emotion recognition and social cues
- **Role-Playing**: Practice real-world scenarios
- **Calm-Down Corner**: Breathing exercises and mindfulness
- **Social Stories**: Interactive narrative learning
- **Mood Check-ins**: Daily emotional awareness

### 3. Progress System
- Skill-based progress tracking
- Achievement badges and celebrations
- Streak counters and consistency rewards
- Visual progress indicators
- Personal growth insights

### 4. Avatar Customization
- Personalized companion character
- Unlockable items through achievements
- Expression system reflecting user mood
- Customizable backgrounds and accessories

## 🧠 Autism-Specific Considerations

### Sensory Sensitivities
- Calming color palette
- Optional sound effects
- Reduced motion preferences
- Gentle, predictable animations

### Cognitive Accessibility
- Simple, clear language
- One task per screen
- Predictable navigation patterns
- Immediate feedback and reinforcement

### Communication Support
- Multiple input methods (text, voice, touch)
- Visual cues supporting text
- Consistent terminology
- Clear instructions and expectations

## 🛠️ Development Guidelines

### Code Standards
- TypeScript strict mode
- ESLint + Prettier configuration
- Accessibility-first development
- Component-based architecture
- Clear documentation and comments

### Testing Requirements
- Unit tests for all utilities
- Integration tests for user flows
- Accessibility testing
- Performance testing
- Manual testing on real devices

### Accessibility Compliance
- WCAG 2.1 AA standard
- Screen reader compatibility
- Keyboard navigation support
- High contrast mode
- Voice control compatibility

## 📊 MVP Features (Phase 1)

### Core Features ✅
- [x] Onboarding flow with avatar creation
- [x] AI companion chat interface
- [x] Social flashcards activity
- [x] Calm-down corner with breathing exercises
- [x] Basic progress tracking and badges
- [x] Avatar customization system
- [x] Accessibility compliance

### Future Features 🔮
- Voice input/output
- Role-playing scenarios
- Social stories
- Advanced analytics
- Parent/caregiver dashboard
- Multi-language support

## 🤝 Contributing

1. Follow the accessibility guidelines in `.cursorrules`
2. Test with screen readers and keyboard navigation
3. Ensure high contrast ratios for all UI elements
4. Write clear, simple language appropriate for target audience
5. Include TypeScript types for all components
6. Add unit tests for new functionality

## 📚 Documentation

Complete documentation is available in the `/docs` folder:
- [Product Requirements](docs/PRD.md)
- [User Flow Diagram](docs/User-Flow-Diagram.md)
- [Wireframes](docs/Wireframes.md)
- [Content Map](docs/Content-Map.md)
- [Gamification System](docs/Gamification-System.md)
- [Accessibility Checklist](docs/Accessibility-Checklist.md)
- [API & Data Flow](docs/API-Data-Flow.md)
- [Development Tasks](docs/Development-Tasks.md)

## 🔐 Privacy & Security

- **Local-First**: All data stored locally on device
- **No Personal Data**: Minimal data collection
- **COPPA Compliant**: Designed for users under 13
- **Privacy Controls**: User-controlled data sharing
- **Secure Storage**: Encrypted sensitive data

## 📞 Support

For questions about autism-specific features or accessibility, please refer to:
- [Accessibility Checklist](docs/Accessibility-Checklist.md)
- [Development Guidelines](.cursorrules)
- [Content Guidelines](docs/Content-Map.md)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Building technology that supports and empowers the autism community through accessible, engaging, and educational experiences.** 