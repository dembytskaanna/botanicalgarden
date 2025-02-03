import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TourProvider } from './src/context/TourContext';
import HomeScreen from './src/screens/HomeScreen';
import TourScreen from './src/screens/TourScreen';
import MapScreen from './src/screens/MapScreen';
import InfoScreen from './src/screens/InfoScreen';
import { SCREENS } from './src/utils/constants';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar style="light" />
        <TourProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName={SCREENS.HOME}
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name={SCREENS.HOME} component={HomeScreen} />
              <Stack.Screen name={SCREENS.TOUR} component={TourScreen} />
              <Stack.Screen name={SCREENS.MAP} component={MapScreen} />
              <Stack.Screen name={SCREENS.INFO} component={InfoScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </TourProvider>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});