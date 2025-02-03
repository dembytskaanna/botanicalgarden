import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TourControls = ({ onNavigate, availableDirections }) => {
  return (
    <View style={styles.container}>
      <View style={styles.navigationContainer}>
        {availableDirections.includes('left') && (
          <TouchableOpacity
            style={[styles.navButton, styles.leftButton]}
            onPress={() => onNavigate('left')}
          >
            <Ionicons name="chevron-back" size={28} color="white" />
          </TouchableOpacity>
        )}
        
        <View style={styles.verticalButtons}>
          {availableDirections.includes('up') && (
            <TouchableOpacity
              style={[styles.navButton, styles.upButton]}
              onPress={() => onNavigate('up')}
            >
              <Ionicons name="chevron-up" size={28} color="white" />
            </TouchableOpacity>
          )}
          
          {availableDirections.includes('down') && (
            <TouchableOpacity
              style={[styles.navButton, styles.downButton]}
              onPress={() => onNavigate('down')}
            >
              <Ionicons name="chevron-down" size={28} color="white" />
            </TouchableOpacity>
          )}
        </View>

        {availableDirections.includes('right') && (
          <TouchableOpacity
            style={[styles.navButton, styles.rightButton]}
            onPress={() => onNavigate('right')}
          >
            <Ionicons name="chevron-forward" size={28} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: '100%',
  },
  verticalButtons: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftButton: {
    marginRight: 'auto',
  },
  rightButton: {
    marginLeft: 'auto',
  },
  upButton: {
    marginBottom: 5,
  },
  downButton: {
    marginTop: 5,
  },
});

export default TourControls;