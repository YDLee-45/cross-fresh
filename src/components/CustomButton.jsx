// src/components/CustomButton.jsx
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import theme from '@/styles/theme';
import { useTranslation } from 'react-i18next';

export default function CustomButton({
  label,
  tKey,          // 추천: 번역 키
  i18nKey,       // 과거 호환
  onPress,
  type = 'primary',  // 'primary' | 'secondary' | 'danger'
  disabled,
  style,
  textStyle,
}) {
  const { t } = useTranslation();

  // 번역 키가 있으면 번역, 없으면 label 그대로 사용
  const key = tKey ?? i18nKey;
  const displayLabel = key ? t(key) : String(label ?? '');

  const bg =
    type === 'primary'   ? theme.colors.primary :
    type === 'danger'    ? theme.colors.danger  :
    type === 'secondary' ? 'transparent'        :
    'transparent';

  const borderColor = type === 'secondary' ? theme.colors.line : 'transparent';
  const labelColor  = type === 'secondary' ? (theme.colors.primaryText ?? '#fff') : '#fff';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          opacity: disabled ? 0.5 : 1,
          backgroundColor: bg,
          borderColor,
          borderWidth: type === 'secondary' ? 1 : 0,
          borderRadius: theme.radius,
          paddingVertical: 14,
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        },
        style,
      ]}
    >
      <Text style={[{ color: labelColor, fontWeight: '700' }, textStyle]}>
        {displayLabel}
      </Text>
    </TouchableOpacity>
  );
}
