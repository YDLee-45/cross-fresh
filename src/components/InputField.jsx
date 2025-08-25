// src/components/InputField.jsx
import React, { forwardRef } from 'react';
import { View, Text, TextInput } from 'react-native';
import theme from '@/styles/theme';

const InputField = forwardRef(
  (
    {
      label,
      value,
      onChangeText,
      placeholder,
      multiline = false,
      style,
      containerStyle,
      ...props
    },
    ref
  ) => {
    return (
      <View style={[{ marginBottom: 12 }, containerStyle]}>
        {label ? <Text style={{ color: '#fff', marginBottom: 6 }}>{label}</Text> : null}

        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.muted}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'auto'}
          keyboardAppearance="dark"
          underlineColorAndroid="transparent"
          selectionColor={theme.colors.primary}
          autoCapitalize="none"
          autoCorrect={false}
          blurOnSubmit={!multiline}
          style={[
            {
              backgroundColor: '#141824',
              color: '#fff',
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 12,
              minHeight: multiline ? 100 : 48,
              borderWidth: 1,
              borderColor: theme.colors.line,
            },
            style,
          ]}
          {...props}
        />
      </View>
    );
  }
);

export default InputField;
