import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Header = ({ title, onBack }) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[
      styles.header, 
      { paddingTop: Platform.OS === 'ios' ? insets.top : 50 }
    ]}>
      <View style={styles.headerBackground} />
      <TouchableOpacity 
        style={styles.backButton}
        onPress={onBack}
      >
        <Ionicons name="chevron-back" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: Platform.OS === 'ios' ? 100 : 70,
    backgroundColor: '#1a1a1a',
  },
  headerBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1a1a1a',
  },
  backButton: {
    padding: 8,
    marginLeft: 8,
  },
  headerTitle: {
    marginLeft: 16,
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
});

export default Header;