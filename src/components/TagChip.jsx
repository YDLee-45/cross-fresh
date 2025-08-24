import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import theme from '@/styles/theme';

export default function TagChip({ label, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 999,
        backgroundColor: active ? theme.colors.primary : 'transparent',
        borderColor: theme.colors.line,
        borderWidth: active ? 0 : 1
      }}
    >
      <Text style={{ color:'#fff' }}>{label}</Text>
    </TouchableOpacity>
  );
}
