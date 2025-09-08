import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Linking from 'expo-linking';
import MatchStepScreen from '../screens/MatchStepScreen';
import MatchResultScreen from '../screens/MatchResultScreen';
import { useMatchStore } from '../store/matchStore';
import { parseFilterLink, parseLikedLink } from '../utils/linkKit';

const Stack = createStackNavigator();

export default function RootNavigator() {
  
  const setFilters = useMatchStore(s => s.setFilters);
  const hydrateLikedFromArray = useMatchStore(s => s.hydrateLikedFromArray);

  useEffect(() => {
    const handleUrl = ({ url }) => {
      const f = parseFilterLink(url);
      if (f) setFilters(f);
      const liked = parseLikedLink(url);
      if (liked && liked.length) hydrateLikedFromArray(liked);
    };
    const sub = Linking.addEventListener('url', handleUrl);
    (async () => {
      const initial = await Linking.getInitialURL();
      if (initial) handleUrl({ url: initial });
    })();
    return () => sub.remove();
  }, [setFilters, hydrateLikedFromArray]);

  return (
    <NavigationContainer linking={{ prefixes: ['cross://'] }}>
      <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
        <Stack.Screen name="MatchStep" component={MatchStepScreen} options={{ title: '매칭 조건' }} />
        <Stack.Screen name="MatchResult" component={MatchResultScreen} options={{ title: '매칭 결과' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
