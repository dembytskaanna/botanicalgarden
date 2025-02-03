import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const springConfig = {
  damping: 15,
  stiffness: 90,
  mass: 1,
  restDisplacementThreshold: 0.001,
  restSpeedThreshold: 0.001,
};

const LocationCard = ({ id, title, description, image, isExpanded, onPress }) => {
  const [contentHeight, setContentHeight] = useState(80);
  const heightValue = useSharedValue(80);
  const opacity = useSharedValue(0);
  const cachedHeights = useRef(new Map());

  useEffect(() => {
    const targetHeight = isExpanded ? (cachedHeights.current.get(id) || contentHeight) : 80;
    heightValue.value = withSpring(targetHeight, springConfig);
    opacity.value = withTiming(isExpanded ? 1 : 0, { duration: 300 });
  }, [isExpanded, contentHeight, id]);

  const containerStyle = useAnimatedStyle(() => ({
    height: heightValue.value,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const onLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    if (isExpanded && height > 80 && height !== cachedHeights.current.get(id)) {
      cachedHeights.current.set(id, height);
      setContentHeight(height);
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Animated.View style={[styles.container, containerStyle]}>
        {!isExpanded ? (
          <View style={styles.collapsedContent}>
            <Image 
              source={image} 
              style={styles.collapsedImage} 
              resizeMode="cover"
            />
            <View style={styles.collapsedTextContainer}>
              <Text style={styles.collapsedTitle} numberOfLines={2}>{title}</Text>
              <Text style={styles.collapsedDescription} numberOfLines={1}>{description}</Text>
            </View>
          </View>
        ) : (
          <Animated.View 
            style={[styles.expandedContent, contentStyle]}
            onLayout={onLayout}
          >
            <Image 
              source={image} 
              style={styles.expandedImage} 
              resizeMode="cover"
            />
            <View style={styles.expandedTextContainer}>
              <Text style={styles.expandedTitle}>{title}</Text>
              <Text style={styles.expandedDescription}>{description}</Text>
            </View>
          </Animated.View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  // Стилі для згорнутого стану
  collapsedContent: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    height: 80,
  },
  collapsedImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  collapsedTextContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 8,
  },
  collapsedTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1a1a1a',
  },
  collapsedDescription: {
    fontSize: 14,
    color: '#666',
  },
  // Стилі для розгорнутого стану
  expandedContent: {
    width: '100%',
  },
  expandedImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 16/9,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  expandedTextContainer: {
    padding: 16,
  },
  expandedTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1a1a1a',
  },
  expandedDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4a4a4a',
  },
});

export default LocationCard;