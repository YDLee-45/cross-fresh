import React, { useState } from 'react';
import { View, Text } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import CustomButton from '@/components/CustomButton';
import theme from '@/styles/theme';

export default function SwipeScreen({ navigation, route }) {
  const initial = route?.params?.filtered ?? [
    { id: 1, name: 'User A', bio: 'Bio A' },
    { id: 2, name: 'User B', bio: 'Bio B' }
  ];
  const [cards] = useState(initial);

  return (
    <View style={{ flex:1, backgroundColor: theme.colors.bg, paddingTop: 24 }}>
      <Text style={{ color:'#fff', fontSize:20, fontWeight:'800', textAlign:'center', marginBottom: 10 }}>스와이프</Text>
      <Swiper
        cards={cards}
        renderCard={(c) => c ? (
          <View style={{ flex:0.65, borderRadius:12, backgroundColor:'#fff', padding:20, alignItems:'center', justifyContent:'center' }}>
            <Text style={{ fontSize:20, fontWeight:'700' }}>{c.name}</Text>
            <Text style={{ color:'#555', marginTop:6 }}>{c.bio}</Text>
          </View>
        ) : null}
        backgroundColor="transparent"
        cardVerticalMargin={50}
        stackSize={3}
        onSwipedRight={(i)=>console.log('Like', cards[i])}
        onSwipedLeft={(i)=>console.log('Skip', cards[i])}
      />
      <View style={{ padding: 16 }}>
        <CustomButton label="매칭 목록 보기" onPress={()=>navigation.navigate('MatchList', { filtered: cards })} type="secondary" />
      </View>
    </View>
  );
}
