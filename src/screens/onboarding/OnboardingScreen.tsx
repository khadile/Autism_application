import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import Button from '../../components/Button';

const OnboardingScreen: React.FC = () => {
  const onNext = () => {
    // Placeholder for navigation
    console.log('Create Avatar pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title} allowFontScaling={false}>Let's Get Started! 🎯</Text>
        <Text style={styles.subtitle} allowFontScaling={false}>Create your avatar and set your goals</Text>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Create Avatar"
            onPress={onNext}
            size="large"
            style={styles.button}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E3A8A',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 26,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 40,
  },
  button: {
    width: '100%',
  },
});

export default OnboardingScreen; 