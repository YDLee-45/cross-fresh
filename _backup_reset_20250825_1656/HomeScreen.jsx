import React from 'react';
import { View, Text, Pressable } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#0b1020', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 16 }}>
        CROSS (Reset Starter)
      </Text>
      <Pressable
        onPress={() => {}}
        style={{ backgroundColor: '#1976d2', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 }}
      >
        <Text style={{ color: '#fff', fontWeight: '700' }}>부팅 확인 버튼</Text>
      </Pressable>
    </View>
  );
}
