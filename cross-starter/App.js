// App.js
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Pressable, Alert } from 'react-native';

const Stack = createNativeStackNavigator();

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Pressable
        onPress={() => Alert.alert('OK', '터치 됨')}
        style={{ padding: 16, borderRadius: 8, backgroundColor: '#4a9' }}
      >
        <Text style={{ color: '#fff', fontSize: 16 }}>터치 테스트</Text>
      </Pressable>
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#111" }}>
      <NavigationContainer>
        <Pressable onPress={() => alert("터치 됨!")}>
          <Text style={{ color: "#fff", fontSize: 20 }}>여기를 터치</Text>
        </Pressable>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
