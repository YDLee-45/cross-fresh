import React from 'react';
import { View, Text, TextInput } from 'react-native';
import theme from '@/styles/theme';

export default function InputField({ label, value, onChangeText, placeholder, multiline, style }) {
  return (
    <View style={{ marginBottom: 12 }}>
      {label ? <Text style={{ color:'#fff', marginBottom:6 }}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.muted}
        multiline={multiline}
        style={{
          backgroundColor: '#141824',
          color: '#fff',
          borderRadius: 10,
          padding: 12,
          minHeight: multiline ? 100 : 48,
          ...(style || {})
        }}
      />
    </View>
  );
}
