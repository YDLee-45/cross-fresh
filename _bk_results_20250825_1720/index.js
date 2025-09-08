import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import SwipeScreen from "../screens/SwipeScreen";

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ["cross://"],
  config: { screens: { Home: "home", Swipe: "swipe" } }
};

export default function AppNavigator() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home"  component={HomeScreen}  options={{ title: "홈" }} />
        <Stack.Screen name="Swipe" component={SwipeScreen} options={{ title: "스와이프" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
