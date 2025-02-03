import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from '../screens/HomeScreen';
import TourScreen from '../screens/TourScreen';
import MapScreen from '../screens/MapScreen';
import InfoScreen from '../screens/InfoScreen';
import { SCREENS } from '../utils/constants';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={SCREENS.HOME}
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            orientation: 'landscape',
          }}
        >
          <Stack.Screen 
            name={SCREENS.HOME} 
            component={HomeScreen}
            options={{
              title: 'Головна',
            }}
          />
          <Stack.Screen 
            name={SCREENS.TOUR} 
            component={TourScreen}
            options={{
              title: 'Тур',
            }}
          />
          <Stack.Screen 
            name={SCREENS.MAP} 
            component={MapScreen}
            options={{
              title: 'Карта',
            }}
          />
          <Stack.Screen 
            name={SCREENS.INFO} 
            component={InfoScreen}
            options={{
              title: 'Інформація',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default AppNavigator;