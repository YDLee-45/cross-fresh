// src/screens/HomeScreen.jsx
import React, { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import useI18nTitle from '../utils/useI18nTitle';

// Zustand
import useMatchStore from '@/store/matchStore'; // alias (@) 사용. 없으면 ../store/matchStore 로 변경

export default function HomeScreen() {

  useI18nTitle('nav.home');
  
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();

  const applyFilter = useMatchStore((s) => s.applyFilterFromLink);
  const applyLiked  = useMatchStore((s) => s.applyLikedFromLink);

  // 보이는지 확인용 로그
  console.log('[HomeScreen] render, lang=', i18n.language);

  const onTestMatch = useCallback(() => {
    applyFilter({ gender: 'female', ageMin: 22, ageMax: 35, tags: ['kind'] });
    Alert.alert('OK', '매칭 필터 적용 완료');
  }, [applyFilter]);

  const onTestLiked = useCallback(() => {
    applyLiked(['u1', 'u2']);
    Alert.alert('OK', '좋아요 2개 적용 완료');
  }, [applyLiked]);

  const goMatchResult = useCallback(() => {
    // App.js에서 라우트명을 MatchResult 로 통일했다면 아래 사용
    navigation.navigate('MatchResult');
  }, [navigation]);

  const goResult = useCallback(() => {
    navigation.navigate('Result');
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CROSS Home ✅</Text>

      {/* 언어 디버그 토글 (Method A) */}
      <View style={styles.langBar}>
        <Pressable style={styles.langBtn} onPress={() => i18n.changeLanguage('ko')}>
          <Text style={styles.langText}>KO</Text>
        </Pressable>
        <Pressable style={styles.langBtn} onPress={() => i18n.changeLanguage('ja')}>
          <Text style={styles.langText}>JA</Text>
        </Pressable>
        <Pressable style={styles.langBtn} onPress={() => i18n.changeLanguage('en')}>
          <Text style={styles.langText}>EN</Text>
        </Pressable>
      </View>

      {/* 테스트 & 네비게이션 */}
      <Pressable style={styles.btn} onPress={onTestMatch}>
        <Text style={styles.btnText}>TEST: MATCH (SIMULATE)</Text>
      </Pressable>

      <Pressable style={styles.btn} onPress={onTestLiked}>
        <Text style={styles.btnText}>TEST: LIKED (SIMULATE)</Text>
      </Pressable>

      <Pressable style={styles.btn} onPress={goMatchResult}>
        <Text style={styles.btnText}>매칭 결과로</Text>
      </Pressable>

      <Pressable style={styles.btn} onPress={goResult}>
        <Text style={styles.btnText}>결과로 이동</Text>
      </Pressable>

      {/* 추가 이동 버튼 */}
      <Pressable style={[styles.btn, styles.secondary]} onPress={() => navigation.navigate('AIDemo')}>
        <Text style={styles.btnText}>AI Demo로 이동</Text>
      </Pressable>
      <Pressable style={[styles.btn, styles.secondary]} onPress={() => navigation.navigate('MatchTest')}>
        <Text style={styles.btnText}>Match Test로 이동</Text>
      </Pressable>
      <Pressable style={[styles.btn, styles.secondary]} onPress={() => navigation.navigate('SwipeScore')}>
        <Text style={styles.btnText}>Swipe + Score로 이동</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, backgroundColor: '#f4f4f4' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  langBar: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  langBtn: { backgroundColor: '#e0e7ff', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 },
  langText: { color: '#1f2937', fontWeight: '700' },

  btn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#0366d6', marginTop: 8, width: '100%' },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
  secondary: { backgroundColor: '#1f6feb' },
});
