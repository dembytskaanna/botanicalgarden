import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  PinchGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/layout/Header';
import LocationCard from '../components/common/LocationCard';
import {
  TOUR_POINTS,
  LOCATION_TITLES,
  LOCATION_DESCRIPTIONS,
  IMAGE_PATHS,
} from '../utils/constants';
import Button from '../components/common/Button';
import { ReviewModal } from '../components/ReviewModal';

const { width, height } = Dimensions.get('window');

const BOTANICAL_GARDEN_REGION = {
  latitude: 50.4134,
  longitude: 30.5639,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

const LOCATIONS_COORDINATES = {
  [TOUR_POINTS.ENTRANCE]: { latitude: 50.4134, longitude: 30.5639 },
  [TOUR_POINTS.SEASONS]: { latitude: 50.4142, longitude: 30.5645 },
  [TOUR_POINTS.MOUNTAIN]: { latitude: 50.4147, longitude: 30.5632 },
  [TOUR_POINTS.KOREAN]: { latitude: 50.4145, longitude: 30.5652 },
  [TOUR_POINTS.BIRCH]: { latitude: 50.415, longitude: 30.5625 },
  [TOUR_POINTS.MIDDLE_ASIA]: { latitude: 50.4148, longitude: 30.566 },
  [TOUR_POINTS.RHODODENDRON]: { latitude: 50.4155, longitude: 30.5645 },
  [TOUR_POINTS.CONIFER]: { latitude: 50.4158, longitude: 30.5635 },
  [TOUR_POINTS.ORANGERY]: { latitude: 50.4156, longitude: 30.5655 },
  [TOUR_POINTS.MONASTERY]: { latitude: 50.4165, longitude: 30.5645 },
  [TOUR_POINTS.LILAC]: { latitude: 50.4168, longitude: 30.5635 },
  [TOUR_POINTS.GARDEN]: { latitude: 50.4166, longitude: 30.5655 },
};

const locations = [
  {
    id: TOUR_POINTS.SEASONS,
    title: LOCATION_TITLES[TOUR_POINTS.SEASONS],
    description: LOCATION_DESCRIPTIONS[TOUR_POINTS.SEASONS],
    image: IMAGE_PATHS[TOUR_POINTS.SEASONS],
  },
  {
    id: TOUR_POINTS.RHODODENDRON,
    title: LOCATION_TITLES[TOUR_POINTS.RHODODENDRON],
    description: LOCATION_DESCRIPTIONS[TOUR_POINTS.RHODODENDRON],
    image: IMAGE_PATHS[TOUR_POINTS.RHODODENDRON],
  },
  {
    id: TOUR_POINTS.MONASTERY,
    title: LOCATION_TITLES[TOUR_POINTS.MONASTERY],
    description: LOCATION_DESCRIPTIONS[TOUR_POINTS.MONASTERY],
    image: IMAGE_PATHS[TOUR_POINTS.MONASTERY],
  },
  {
    id: TOUR_POINTS.MOUNTAIN,
    title: LOCATION_TITLES[TOUR_POINTS.MOUNTAIN],
    description: LOCATION_DESCRIPTIONS[TOUR_POINTS.MOUNTAIN],
    image: IMAGE_PATHS[TOUR_POINTS.MOUNTAIN],
  },
  {
    id: TOUR_POINTS.BIRCH,
    title: LOCATION_TITLES[TOUR_POINTS.BIRCH],
    description: LOCATION_DESCRIPTIONS[TOUR_POINTS.BIRCH],
    image: IMAGE_PATHS[TOUR_POINTS.BIRCH],
  },
  {
    id: TOUR_POINTS.CONIFER,
    title: LOCATION_TITLES[TOUR_POINTS.CONIFER],
    description: LOCATION_DESCRIPTIONS[TOUR_POINTS.CONIFER],
    image: IMAGE_PATHS[TOUR_POINTS.CONIFER],
  },
  {
    id: TOUR_POINTS.LILAC,
    title: LOCATION_TITLES[TOUR_POINTS.LILAC],
    description: LOCATION_DESCRIPTIONS[TOUR_POINTS.LILAC],
    image: IMAGE_PATHS[TOUR_POINTS.LILAC],
  },
  {
    id: TOUR_POINTS.KOREAN,
    title: LOCATION_TITLES[TOUR_POINTS.KOREAN],
    description: LOCATION_DESCRIPTIONS[TOUR_POINTS.KOREAN],
    image: IMAGE_PATHS[TOUR_POINTS.KOREAN],
  },
  {
    id: TOUR_POINTS.MIDDLE_ASIA,
    title: LOCATION_TITLES[TOUR_POINTS.MIDDLE_ASIA],
    description: LOCATION_DESCRIPTIONS[TOUR_POINTS.MIDDLE_ASIA],
    image: IMAGE_PATHS[TOUR_POINTS.MIDDLE_ASIA],
  },
  {
    id: TOUR_POINTS.ORANGERY,
    title: LOCATION_TITLES[TOUR_POINTS.ORANGERY],
    description: LOCATION_DESCRIPTIONS[TOUR_POINTS.ORANGERY],
    image: IMAGE_PATHS[TOUR_POINTS.ORANGERY],
  },
  {
    id: TOUR_POINTS.GARDEN,
    title: LOCATION_TITLES[TOUR_POINTS.GARDEN],
    description: LOCATION_DESCRIPTIONS[TOUR_POINTS.GARDEN],
    image: IMAGE_PATHS[TOUR_POINTS.GARDEN],
  },
];

const MapScreen = ({ navigation }) => {
  const mapRef = useRef(null);
  const [expandedId, setExpandedId] = useState(null);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const onSwipeRight = ({ nativeEvent }) => {
    if (nativeEvent.translationX > 100) {
      navigation.navigate('Home');
    }
  };

  const handleCardPress = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleMarkerPress = (locationId) => {
    handleCardPress(locationId);
    setSelectedLocation(locationId);
    setReviewModalVisible(true);
    mapRef.current?.animateToRegion(
      {
        ...LOCATIONS_COORDINATES[locationId],
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      },
      1000
    );
  };

  const centerImage = (newScale) => {
    const maxTranslateX = (width * (newScale - 1)) / 2;
    const currentTranslateX = translateX.value;

    if (Math.abs(currentTranslateX) > maxTranslateX) {
      translateX.value = currentTranslateX > 0 ? maxTranslateX : -maxTranslateX;
    }
  };

  const toggleMapFullscreen = () => {
    if (!isMapFullscreen) {
      scale.value = 1;
      savedScale.value = 1;
      translateX.value = 0;
      translateY.value = 0;
    }
    setIsMapFullscreen(!isMapFullscreen);
  };

  const pinchHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startScale = scale.value;
      context.startTranslateX = translateX.value;
      context.startTranslateY = translateY.value;
    },
    onActive: (event, context) => {
      const newScale = Math.min(
        Math.max(context.startScale * event.scale, 1),
        4
      );
      scale.value = newScale;

      const maxTranslateX = (width * (newScale - 1)) / 2;
      const maxTranslateY = (height * (newScale - 1)) / 2;

      translateX.value = Math.min(
        Math.max(-maxTranslateX, translateX.value),
        maxTranslateX
      );
      translateY.value = Math.min(
        Math.max(-maxTranslateY, translateY.value),
        maxTranslateY
      );
    },
    onEnd: () => {
      const maxTranslateX = (width * (scale.value - 1)) / 2;
      const maxTranslateY = (height * (scale.value - 1)) / 2;

      translateX.value = Math.min(
        Math.max(-maxTranslateX, translateX.value),
        maxTranslateX
      );
      translateY.value = Math.min(
        Math.max(-maxTranslateY, translateY.value),
        maxTranslateY
      );
    },
  });

  const panHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      const maxTranslateX = (width * (scale.value - 1)) / 2;
      const maxTranslateY = (height * (scale.value - 1)) / 2;

      translateX.value = Math.min(
        Math.max(context.startX + event.translationX, -maxTranslateX),
        maxTranslateX
      );
      translateY.value = Math.min(
        Math.max(context.startY + event.translationY, -maxTranslateY),
        maxTranslateY
      );
    },
    onEnd: () => {
      const maxTranslateX = (width * (scale.value - 1)) / 2;
      const maxTranslateY = (height * (scale.value - 1)) / 2;

      translateX.value = Math.min(
        Math.max(translateX.value, -maxTranslateX),
        maxTranslateX
      );
      translateY.value = Math.min(
        Math.max(translateY.value, -maxTranslateY),
        maxTranslateY
      );
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler onEnded={onSwipeRight}>
        <View style={styles.container}>
          <Header
            title="Карта ботанічного саду"
            onBack={() => navigation.goBack()}
          />
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.mapContainer}>
              <View style={styles.googleMapContainer}>
                <MapView
                  ref={mapRef}
                  provider={PROVIDER_DEFAULT}
                  style={styles.googleMap}
                  initialRegion={BOTANICAL_GARDEN_REGION}>
                  {locations.map((location) => (
                    <Marker
                      key={location.id}
                      coordinate={LOCATIONS_COORDINATES[location.id]}
                      onPress={() => handleMarkerPress(location.id)}>
                      <View style={styles.markerContainer}>
                        <View style={styles.marker} />
                        {selectedLocation === location.id && (
                          <View style={styles.markerInfoContainer}>
                            <Text style={styles.markerTitle}>
                              {location.title}
                            </Text>
                            <Text
                              style={styles.markerDescription}
                              numberOfLines={2}>
                              {location.description}
                            </Text>
                          </View>
                        )}
                      </View>
                    </Marker>
                  ))}
                </MapView>
              </View>

              <TouchableWithoutFeedback onPress={toggleMapFullscreen}>
                <View>
                  <Image
                    source={require('../assets/images/0botanical_garden_map-min.JPG')}
                    style={styles.mapImage}
                    resizeMode="contain"
                  />
                  <View style={styles.magnifyIconContainer}>
                    <Ionicons name="search" size={24} color="white" />
                  </View>
                </View>
              </TouchableWithoutFeedback>
              <Text style={styles.mapLabel}>Карта ботанічного саду</Text>
            </View>

            <View style={styles.locationsContainer}>
              <Text style={styles.sectionTitle}>Локації саду</Text>
              {locations.map((location) => (
                <LocationCard
                  key={location.id}
                  id={location.id}
                  title={location.title}
                  description={location.description}
                  image={location.image}
                  isExpanded={expandedId === location.id}
                  onPress={() => handleCardPress(location.id)}
                />
              ))}
            </View>

            <View style={styles.buttonContainer}>
              <Button
                title="На Головну"
                onPress={() => navigation.navigate('Home')}
                style={styles.homeButton}
              />
            </View>
          </ScrollView>

          <Modal
            visible={isMapFullscreen}
            transparent={true}
            animationType="fade"
            onRequestClose={toggleMapFullscreen}>
            <View style={styles.modalContainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={toggleMapFullscreen}>
                <Ionicons name="close" size={30} color="white" />
              </TouchableOpacity>

              <PanGestureHandler onGestureEvent={panHandler}>
                <Animated.View style={styles.modalContent}>
                  <PinchGestureHandler onGestureEvent={pinchHandler}>
                    <Animated.View>
                      <Animated.Image
                        source={require('../assets/images/0botanical_garden_map-min.JPG')}
                        style={[styles.fullscreenImage, animatedStyle]}
                        resizeMode="contain"
                      />
                    </Animated.View>
                  </PinchGestureHandler>
                </Animated.View>
              </PanGestureHandler>

              <Text style={styles.zoomHint}>
                Використовуйте жести для масштабування
              </Text>
            </View>
          </Modal>
          <ReviewModal
            isVisible={isReviewModalVisible}
            locationId={selectedLocation}
            locationTitle={
              selectedLocation ? LOCATION_TITLES[selectedLocation] : ''
            }
            onClose={() => setReviewModalVisible(false)}
          />
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 10,
  },
  mapContainer: {
    padding: 16,
    alignItems: 'center',
  },
  googleMapContainer: {
    width: width - 32,
    height: (width - 32) * 0.75,
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  googleMap: {
    width: '100%',
    height: '100%',
  },
  mapImage: {
    width: width - 32,
    height: (width - 32) * 0.75,
    borderRadius: 8,
  },
  magnifyIconContainer: {
    position: 'absolute',
    right: 8,
    bottom: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    padding: 8,
  },
  mapLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  locationsContainer: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: width,
    height: height,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  zoomHint: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  homeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    height: 48,
    marginBottom: 24,
  },
  markerContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  marker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2196F3',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerInfoContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    left: '50%',
    transform: [{ translateX: -100 }],
    bottom: 25,
    width: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    zIndex: 10,
  },
  markerTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
    color: '#1a1a1a',
  },
  markerDescription: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
    lineHeight: 16,
  },
});

export default MapScreen;