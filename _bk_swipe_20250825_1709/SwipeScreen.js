// src/screens/SwipeScreen.jsx
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import Swiper from 'react-native-deck-swiper';

import CustomButton from '@/components/CustomButton';
import theme from '@/styles/theme';
import useMatchStore from '@/store/matchStore';
import { aiMatchScore } from '@/services/ai';
import useI18nTitle from '@/utils/useI18nTitle';

export default function SwipeScreen({ navigation, route }) {
  useI18nTitle?.('nav.swipeScore'); // i18n 키 없으면 무해

  // 카드 목록 (param.filtered가 배열이 아니면 기본 더미 사용)
  const initial =
    Array.isArray(route?.params?.filtered) && route.params.filtered.length
      ? route.params.filtered
      : [
          { id: 1, name: 'User A', bio: 'Bio A', hobby: ['movie'] },
          { id: 2, name: 'User B', bio: 'Bio B', hobby: ['hiking'] },
        ];

  // 내 프로필 기본값(점수 계산 다양화)
  const me = route?.params?.me ?? { age: 30, hobby: ['movie', 'hiking'] };

  const [cards] = useState(initial);
  const swiperRef = useRef(null);

  // store actions
  const addResult = useMatchStore((s) => s.addResult);
  const toggleLike = useMatchStore((s) => s.toggleLike);

  const bgColor = theme?.colors?.bg || '#0b1220';

  const safeScore = useCallback((v) => {
    if (typeof v === 'number' && Number.isFinite(v)) {
      return Math.max(0, Math.min(100, Math.round(v)));
    }
    // 폴백 점수: 40~100
    return Math.round(40 + Math.random() * 60);
  }, []);

  const getByIndex = useCallback((i) => (i >= 0 && i < cards.length ? cards[i] : null), [cards]);

  const onSwipedRight = useCallback(
    async (i) => {
      const person = getByIndex(i);
      if (!person) return;

      // 1) 좋아요 토글
      toggleLike(person.id);

      // 2) AI 점수 계산 (실패하면 랜덤 폴백)
      try {
        const data = await aiMatchScore(me, person);
        const score = safeScore(data?.score);
        addResult(person, score);
        console.log('[Swipe] like + score', person, score);
      } catch (e) {
        const score = safeScore();
        addResult(person, score);
        console.warn('[Swipe] score failed, fallback', e);
      }
    },
    [getByIndex, toggleLike, addResult, me, safeScore]
  );

  const onSwipedLeft = useCallback(
    (i) => {
      const person = getByIndex(i);
      if (!person) return;
      console.log('[Swipe] skip', person?.id ?? i, person?.name);
      // 기록만 남기려면 아래 사용
      // addResult(person, 0);
    },
    [getByIndex /*, addResult*/]
  );

  const resultButton = useMemo(
    () => (
      <CustomButton
        label="매칭 결과 보기"
        onPress={() => navigation.navigate('MatchResult', { filtered: cards })}
        type="secondary"
      />
    ),
    [navigation, cards]
  );

  return (
    <View style={{ flex: 1, backgroundColor: bgColor, paddingTop: 24 }}>
      <Text
        style={{
          color: '#fff',
          fontSize: 20,
          fontWeight: '800',
          textAlign: 'center',
          marginBottom: 10,
        }}
      >
        스와이프
      </Text>

      <Swiper
        ref={swiperRef}
        cards={cards}
        cardIndex={0}
        renderCard={(c) =>
          c ? (
            <View
              style={{
                flex: 0.65,
                borderRadius: 12,
                backgroundColor: '#fff',
                padding: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: '700' }}>{c.name}</Text>
              <Text style={{ color: '#555', marginTop: 6 }}>{c.bio}</Text>
            </View>
          ) : null
        }
        backgroundColor="transparent"
        cardVerticalMargin={50}
        stackSize={3}
        onSwipedRight={onSwipedRight}
        onSwipedLeft={onSwipedLeft}
        disableBottomSwipe
        disableTopSwipe
        stackSeparation={15}
        animateCardOpacity
      />

      <View style={{ padding: 16 }}>{resultButton}</View>
    </View>
  );
}
