import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AvatarScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customize Your Avatar 🎨</Text>
      <Text style={styles.subtitle}>Make your companion uniquely yours</Text>
    </View>
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

export default AvatarScreen; 