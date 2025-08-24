import React from 'react';
import { Image, View } from 'react-native';

export default function AppLogo({ size = 112 }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={require('../../assets/logo/cross-logo.png')}
        style={{ width: size, height: size, resizeMode: 'contain' }}
      />
    </View>
  );
}
