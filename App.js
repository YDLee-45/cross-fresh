// App.js
import './src/utils/i18n';

import React from 'react';
import { ScrollView, Text, Pressable, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// ✅ 첫 스텝: AIDemo만 임포트 (나머지는 아직 X)
import AIDemoScreen from './src/screens/AIDemoScreen';
// import MatchTestScreen from './src/screens/MatchTestScreen';
// import SwipeScoreScreen from './src/screens/SwipeScoreScreen';
// import ResultScreen from './src/screens/ResultScreen';
// import MatchResultScreen from './src/screens/MatchResultScreen';
// import './src/utils/i18n';  // 나중에 켬

const Stack = createNativeStackNavigator();

function Home({ navigation }) {
  const pages = ['AIDemo']; // ← 처음엔 하나만
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Home</Text>
      {pages.map((n) => (
        <Pressable key={n} style={s.btn} onPress={() => navigation.navigate(n)}>
          <Text style={s.txt}>{n}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="AIDemo" component={AIDemoScreen} />
        {/* 나머지는 통과되면 하나씩 아래에 추가 */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const s = StyleSheet.create({
  btn: { padding: 12, backgroundColor: '#1976d2', borderRadius: 10, marginBottom: 8 },
  txt: { color: '#fff', fontWeight: '700', textAlign: 'center' },
});
