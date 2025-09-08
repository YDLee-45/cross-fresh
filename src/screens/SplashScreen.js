import React, { useEffect } from 'react';
import { View, ActivityIndicator, Image } from 'react-native';
import theme from '@/styles/theme';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const t = setTimeout(() => navigation.replace('Login'), 800);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <View style={{ flex:1, backgroundColor: theme.colors.bg, alignItems:'center', justifyContent:'center' }}>
      <Image source={require('../../assets/splash-icon.png')} style={{ width:128, height:128, marginBottom:16 }} />
      <ActivityIndicator size="small" color="#fff" />
    </View>
  );
}
