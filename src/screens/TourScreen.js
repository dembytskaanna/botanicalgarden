import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useTour } from '../context/TourContext';
import Header from '../components/layout/Header';
import PanoramaView from '../components/tour/PanoramaView';
import LocationInfo from '../components/tour/LocationInfo';

const TourScreen = ({ navigation }) => {
  const { currentLocation, setCurrentLocation, locationInfo, resetLocation } = useTour();

  useEffect(() => {
    return () => {
      resetLocation();
    };
  }, []);

  const handleNavigate = (direction) => {
    if (!locationInfo?.connections || !locationInfo.connections[direction]) {
      return;
    }
    setCurrentLocation(locationInfo.connections[direction]);
  };

  return (
    <View style={styles.container}>
      <Header 
        title={locationInfo?.title || 'Tour'} 
        onBack={() => navigation.goBack()} 
      />
      
      <View style={styles.tourContainer}>
        {locationInfo.imageUrl && (
          <>
            <View style={styles.panoramaContainer}>
              <PanoramaView imageUrl={locationInfo.imageUrl} />
            </View>

            <View style={styles.navigationContainer}>
              {/* Стрілка вліво */}
              {locationInfo.availableDirections?.includes('left') && (
                <View style={styles.leftButtonContainer}>
                  <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => handleNavigate('left')}
                  >
                    <Ionicons name="chevron-back" size={30} color="white" />
                  </TouchableOpacity>
                </View>
              )}

              {/* Контейнер для вертикальних стрілок */}
              <View style={styles.verticalButtonsContainer}>
                {/* Стрілка вгору */}
                {locationInfo.availableDirections?.includes('up') && (
                  <TouchableOpacity
                    style={[styles.navButton, styles.upButton]}
                    onPress={() => handleNavigate('up')}
                  >
                    <Ionicons name="chevron-up" size={30} color="white" />
                  </TouchableOpacity>
                )}

                {/* Стрілка вниз */}
                {locationInfo.availableDirections?.includes('down') && (
                  <TouchableOpacity
                    style={[styles.navButton, styles.downButton]}
                    onPress={() => handleNavigate('down')}
                  >
                    <Ionicons name="chevron-down" size={30} color="white" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Стрілка вправо */}
              {locationInfo.availableDirections?.includes('right') && (
                <View style={styles.rightButtonContainer}>
                  <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => handleNavigate('right')}
                  >
                    <Ionicons name="chevron-forward" size={30} color="white" />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {locationInfo && <LocationInfo />}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  tourContainer: {
    flex: 1,
  },
  panoramaContainer: {
    flex: 1,
    position: 'relative',
  },
  navigationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 120, // Додано відступ знизу, щоб не перекривати інфо-блок
    zIndex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  leftButtonContainer: {
    position: 'absolute',
    left: 20,
    top: '50%', // Центрування по вертикалі
    transform: [{ translateY: -30 }], // Половина висоти кнопки для точного центрування
  },
  rightButtonContainer: {
    position: 'absolute',
    right: 20,
    top: '50%', // Центрування по вертикалі
    transform: [{ translateY: -30 }], // Половина висоти кнопки для точного центрування
  },
  verticalButtonsContainer: {
    position: 'absolute',
    left: '50%',
    top: '50%', // Центрування по вертикалі
    transform: [{ translateX: -30 }, { translateY: -70 }], // Зміщення для центрування групи кнопок
    alignItems: 'center',
    flexDirection: 'column',
    gap: 20,
  },
  navButton: {
    width: 52,
    height: 52,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  upButton: {
    marginBottom: 10,
  },
  downButton: {
    marginTop: 10,
  },
});

export default TourScreen;