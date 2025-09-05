import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Text, View } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#101214' }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>
          🚀 Cross Final — Fresh Start
        </Text>
        <Text style={{ color: '#A0A4A8', marginTop: 8 }}>
          one-shot로 바로 빌드 가능한 최대 베이스
        </Text>
      </View>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}
