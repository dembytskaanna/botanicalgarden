import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTour } from '../../context/TourContext';
import { LOCATION_TITLES, LOCATION_DESCRIPTIONS } from '../../utils/constants';

const LocationInfo = () => {
  const { currentLocation } = useTour();
  
  const title = LOCATION_TITLES[currentLocation];
  const description = LOCATION_DESCRIPTIONS[currentLocation];

  return (
    <Animated.View style={styles.container}>
      <View style={styles.infoBox}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginBottom: 40, // Додано відступ знизу
    height: 120, // Фіксована висота замість відсотків
    justifyContent: 'flex-end', // Вирівнювання по нижньому краю
  },
  infoBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 15,
    padding: 16,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  title: {
    color: 'papayawhip',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: '#333333',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  description: {
    color: 'papayawhip',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    textShadowColor: '#333333',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default LocationInfo;