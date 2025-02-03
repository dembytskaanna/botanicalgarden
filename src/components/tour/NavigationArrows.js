import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export const NavigationArrows = ({ onNavigate, availableDirections }) => {
  return (
    <View style={styles.container}>
      {availableDirections.map((direction) => (
        <TouchableOpacity
          key={direction}
          style={styles.arrow}
          onPress={() => onNavigate(direction)}
        >
          <Ionicons name="arrow-forward" size={32} color="white" />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  arrow: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    padding: 10,
  },
});