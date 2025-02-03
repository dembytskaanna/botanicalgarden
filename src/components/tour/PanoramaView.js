import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { PanGestureHandler, PinchGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const PANORAMA_ASPECT_RATIO = 3778 / 875;
const MIN_SCALE = 1;
const MAX_SCALE = 3;

const PanoramaView = ({ imageUrl }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const prevScale = useSharedValue(1);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);
  const oldFocalX = useSharedValue(0);
  const oldFocalY = useSharedValue(0);

  const panoramaHeight = SCREEN_HEIGHT;
  const panoramaWidth = panoramaHeight * PANORAMA_ASPECT_RATIO;

  // Скидання значень при зміні зображення
  useEffect(() => {
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    scale.value = withSpring(1);
    prevScale.value = 1;
  }, [imageUrl]);

  const pinchHandler = useAnimatedGestureHandler({
    onStart: (event) => {
      oldFocalX.value = event.focalX;
      oldFocalY.value = event.focalY;
      prevScale.value = scale.value;
    },
    onActive: (event) => {
      // Обчислюємо нове значення масштабу
      const newScale = Math.min(Math.max(prevScale.value * event.scale, MIN_SCALE), MAX_SCALE);
      
      // Зберігаємо поточну точку фокусу
      focalX.value = event.focalX;
      focalY.value = event.focalY;
      
      // Обчислюємо різницю між старою і новою точками фокусу
      const changeX = (focalX.value - oldFocalX.value);
      const changeY = (focalY.value - oldFocalY.value);

      // Обчислюємо зсув для збереження точки фокусу
      const pinchTranslateX = (focalX.value - SCREEN_WIDTH / 2) * (1 - event.scale);
      const pinchTranslateY = (focalY.value - SCREEN_HEIGHT / 2) * (1 - event.scale);

      // Оновлюємо позицію з урахуванням обмежень
      const maxTranslateX = (panoramaWidth * newScale - SCREEN_WIDTH) / 2;
      const maxTranslateY = (panoramaHeight * newScale - SCREEN_HEIGHT) / 2;

      translateX.value = Math.min(Math.max(translateX.value + pinchTranslateX + changeX, -maxTranslateX), maxTranslateX);
      translateY.value = Math.min(Math.max(translateY.value + pinchTranslateY + changeY, -maxTranslateY), maxTranslateY);
      
      // Оновлюємо масштаб
      scale.value = newScale;
      
      // Оновлюємо старі координати фокусу
      oldFocalX.value = focalX.value;
      oldFocalY.value = focalY.value;
    },
    onEnd: () => {
      // Перевірка і корекція масштабу якщо потрібно
      if (scale.value < MIN_SCALE) {
        scale.value = withSpring(MIN_SCALE);
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }

      // Перевірка і корекція позиції
      const maxTranslateX = (panoramaWidth * scale.value - SCREEN_WIDTH) / 2;
      const maxTranslateY = (panoramaHeight * scale.value - SCREEN_HEIGHT) / 2;

      if (Math.abs(translateX.value) > maxTranslateX) {
        translateX.value = withSpring(translateX.value > 0 ? maxTranslateX : -maxTranslateX);
      }

      if (Math.abs(translateY.value) > maxTranslateY) {
        translateY.value = withSpring(translateY.value > 0 ? maxTranslateY : -maxTranslateY);
      }
    },
  });

  const panHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      const maxTranslateX = (panoramaWidth * scale.value - SCREEN_WIDTH) / 2;
      const maxTranslateY = (panoramaHeight * scale.value - SCREEN_HEIGHT) / 2;

      translateX.value = Math.min(Math.max(context.startX + event.translationX, -maxTranslateX), maxTranslateX);
      translateY.value = Math.min(Math.max(context.startY + event.translationY, -maxTranslateY), maxTranslateY);
    },
    onEnd: (event) => {
      const maxTranslateX = (panoramaWidth * scale.value - SCREEN_WIDTH) / 2;
      const maxTranslateY = (panoramaHeight * scale.value - SCREEN_HEIGHT) / 2;

      // Застосовуємо інерцію з обмеженнями
      translateX.value = withDecay({
        velocity: event.velocityX,
        clamp: [-maxTranslateX, maxTranslateX],
      });
      translateY.value = withDecay({
        velocity: event.velocityY,
        clamp: [-maxTranslateY, maxTranslateY],
      });
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
    <View style={styles.container}>
      <PinchGestureHandler onGestureEvent={pinchHandler}>
        <Animated.View style={styles.pinchContainer}>
          <PanGestureHandler onGestureEvent={panHandler}>
            <Animated.View style={[styles.imageContainer, animatedStyle]}>
              <Image
                source={imageUrl}
                style={[
                  styles.panoramaImage,
                  {
                    width: panoramaWidth,
                    height: panoramaHeight,
                  },
                ]}
                resizeMode="cover"
              />
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </PinchGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  pinchContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  panoramaImage: {
    flex: 1,
  },
});

export default PanoramaView;