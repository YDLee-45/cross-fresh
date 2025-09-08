// src/navigation/index.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SwipeScreen from '../screens/SwipeScreen';
import FilterScreen from '../screens/FilterScreen';
import LikedScreen from '../screens/LikedScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';

const Stack = createNativeStackNavigator();

export default function StackNav() {
  return (
    <Stack.Navigator /* initialRouteName="Home" 등 필요시 */>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Swipe" component={SwipeScreen} />
      <Stack.Screen name="Filter" component={FilterScreen} />
      <Stack.Screen name="Liked" component={LikedScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}
