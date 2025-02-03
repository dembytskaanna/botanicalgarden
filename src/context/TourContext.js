import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { 
  TOUR_POINTS, 
  LOCATION_TITLES, 
  LOCATION_DESCRIPTIONS, 
  IMAGE_PATHS, 
  LOCATION_COORDINATES 
} from '../utils/constants';
import { tourConfig } from '../config/tourConfig';

const TourContext = createContext(null);

export const TourProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(tourConfig.startPoint);
  const [isLoading, setIsLoading] = useState(false);

  // Використовуємо useMemo для обчислення locationInfo
  const locationInfo = useMemo(() => {
    const location = tourConfig.locations[currentLocation];
    if (!location) {
      return {
        title: '',
        description: '',
        imageUrl: null,
        coordinates: { x: 0, y: 0 },
        connections: {},
        availableDirections: [],
      };
    }

    return {
      title: LOCATION_TITLES[currentLocation],
      description: LOCATION_DESCRIPTIONS[currentLocation],
      imageUrl: IMAGE_PATHS[currentLocation],
      coordinates: LOCATION_COORDINATES[currentLocation],
      connections: location.connections,
      availableDirections: location.availableDirections,
    };
  }, [currentLocation]);

  // Функція для переходу до наступної локації
  const navigateToLocation = (direction) => {
    const location = tourConfig.locations[currentLocation];
    if (!location || !location.connections[direction]) {
      return;
    }

    setIsLoading(true);
    const nextLocation = location.connections[direction];
    setCurrentLocation(nextLocation);
    setIsLoading(false);
  };

  // Функція для скидання локації до початкової
  const resetLocation = () => {
    setCurrentLocation(tourConfig.startPoint);
  };

  // Логування для відстеження стану
  useEffect(() => {
    console.log('Current location:', currentLocation);
    console.log('Location info:', locationInfo);
  }, [currentLocation, locationInfo]);

  // Перевіряємо доступні напрямки для поточної локації
  const availableDirections = useMemo(() => {
    const location = tourConfig.locations[currentLocation];
    if (!location) return [];
    
    return Object.keys(location.connections).filter(
      direction => !!location.connections[direction]
    );
  }, [currentLocation]);

  // Мемоізуємо значення контексту
  const value = useMemo(() => ({
    currentLocation,
    setCurrentLocation,
    isLoading,
    setIsLoading,
    locationInfo,
    navigateToLocation,
    resetLocation,
    availableDirections,
  }), [
    currentLocation,
    isLoading,
    locationInfo,
    availableDirections
  ]);

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
};

// Хук для використання контексту з перевіркою
export const useTour = () => {
  const context = useContext(TourContext);
  if (context === null) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};

export const TOUR_LOCATIONS = {
  ...tourConfig.locations,
};