import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ['cross://'],
  config: { screens: { Home: 'home' } },
};

export default function AppNavigator() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: '홈' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
