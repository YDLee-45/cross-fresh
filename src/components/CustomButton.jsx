import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import theme from '@/styles/theme';
import { useTranslation } from 'react-i18next';

export default function CustomButton({ label, onPress, type='primary', disabled, style }) {
  const { t } = useTranslation();

  const bg = 
      type === 'primary' ? theme.colors.primary :
      type === 'danger' ? theme.colors.danger   :
      type === 'secondary'? 'transparent'       :
      'transparent';

  const border = type === 'secondary' ? theme.colors.line : 'transparent';
  const displayLabel = i18nKey ? t(i18nKey) : label;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        opacity: disabled ? 0.5 : 1,
        backgroundColor: bg,
        borderColor: border,
        borderWidth: type === 'secondary' ? 1 : 0,
        borderRadius: theme.radius,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        ...(style || {})
      }}
    >
      <Text style={{ color: '#fff', fontWeight: '700' }}>{displayLabel}</Text>
    </TouchableOpacity>
  );
}
