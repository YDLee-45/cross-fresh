import React from 'react';
import { View, Pressable, Text } from 'react-native';
import i18n from '../utils/i18n';

export default function LanguageSwitch() {
  return (
    <View style={{ flexDirection:'row', gap:8, marginBottom:8 }}>
      {[
        { code: 'ko', label: '한국어' },
        { code: 'en', label: 'EN' },
        { code: 'ja', label: '日本語' }
      ].map(x => (
        <Pressable key={x.code}
          onPress={() => i18n.changeLanguage(x.code)}
          style={{ paddingVertical:6, paddingHorizontal:10, borderRadius:10, backgroundColor:'#eee' }}>
          <Text>{x.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
