// src/components/LanguageDebugBar.js
import React from 'react';
import { View, Button } from 'react-native';
import { useTranslation } from 'react-i18next';
import { setAppLanguage } from '@/utils/i18n';

export default function LanguageDebugBar() {
  const { i18n } = useTranslation();
  return (
    <View style={{ flexDirection:'row', gap:8, padding:8, justifyContent:'center' }}>
      <Button title="KO" onPress={() => setAppLanguage('ko')} />
      <Button title="JA" onPress={() => setAppLanguage('ja')} />
      <Button title="EN" onPress={() => setAppLanguage('en')} />
    </View>
  );
}
