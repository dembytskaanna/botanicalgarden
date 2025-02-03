import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export const Loading = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#2196F3" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});