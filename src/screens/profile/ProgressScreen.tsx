import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const ProgressScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title} allowFontScaling={false}>Your Progress 📊</Text>
        <Text style={styles.subtitle} allowFontScaling={false}>See how you're growing and improving</Text>
        
        {/* Progress content will be added here */}
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
});

export default ProgressScreen; 