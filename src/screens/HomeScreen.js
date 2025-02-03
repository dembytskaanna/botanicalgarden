import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SCREENS } from '../utils/constants';

const SplashScreen = ({ onFinish }) => {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    setTimeout(onFinish, 2000);
  }, []);

  return (
    <View style={styles.splashContainer}>
      <Animated.View style={[styles.splashContent, { opacity: fadeAnim }]}>
        <Image 
          source={require('../assets/images/app-logo.png')}
          style={styles.splashLogo}
        />
        <Text style={styles.splashTitle}>Ботанічний сад</Text>
        <Text style={styles.splashSubtitle}></Text>
      </Animated.View>
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  const MenuButton = ({ icon, title, onPress }) => (
    <TouchableOpacity 
      style={styles.menuButton} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name={icon} size={28} color="#1a1a1a" style={styles.buttonIcon} />
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/leaf-pattern.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Ботанічний сад</Text>
        <Text style={styles.subtitle}>Віртуальний тур</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <MenuButton 
          icon="compass-outline"
          title="Почати тур"
          onPress={() => navigation.navigate(SCREENS.TOUR)}
        />
        <MenuButton 
          icon="map-outline"
          title="Карта саду"
          onPress={() => navigation.navigate(SCREENS.MAP)}
        />
        <MenuButton 
          icon="information-circle-outline"
          title="Інформація"
          onPress={() => navigation.navigate(SCREENS.INFO)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  splashContent: {
    alignItems: 'center',
  },
  splashLogo: {
    width: 120,
    height: 100, // Зменшена висота для збереження пропорцій
    resizeMode: 'contain', // Додано для коректного відображення пропорцій
    marginBottom: 40,
  },
  splashTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  splashSubtitle: {
    fontSize: 18,
    color: '#4a4a4a',
  },
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 8, 8, 0.5)',
  },
  header: {
   position: 'absolute',
   width: '100%',
   alignItems: 'center',
   top: '25%',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 48,
  },
  buttonContainer: {
   position: 'absolute',
   width: '100%',
   top: '50%',
   paddingHorizontal: 20,
   gap: 16,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
  },
  buttonIcon: {
    marginRight: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  }
});

export default HomeScreen;