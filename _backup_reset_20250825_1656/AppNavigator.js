// src/navigation/AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import AIDemoScreen from '../screens/AIDemoScreen';
import MatchStepScreen from '../screens/MatchStepScreen';
import MatchResultScreen from '../screens/MatchResultScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerTitleAlign: 'center' }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Stack.Screen name="AIDemo" component={AIDemoScreen} options={{ title: 'AI Demo' }} />
      <Stack.Screen name="MatchStep" component={MatchStepScreen} options={{ title: '매칭 조건' }} />
      <Stack.Screen name="MatchResult" component={MatchResultScreen} options={{ title: '매칭 결과' }} />
    </Stack.Navigator>
  );
}
