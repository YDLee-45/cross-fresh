// src/screens/MatchResultScreen.jsx
import React, { useMemo, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import useMatchStore from '../store/matchStore';
import useI18nTitle from '../utils/useI18nTitle';

export default function MatchResultScreen() {
  useI18nTitle('nav.matchResult');
  const navigation = useNavigation();
  const { t } = useTranslation();

  const results  = useMatchStore((s) => s.results) || [];
  const likedArr = useMatchStore((s) => s.liked) || [];
  const hydrated = useMatchStore((s) => s.hydrated);

  if (!hydrated) {
    return (
      <View style={styles.center}>
        <Text style={styles.dim}>{t('loading', { defaultValue: '로딩 중...' })}</Text>
      </View>
    );
  }

  const likedSet = useMemo(() => new Set((likedArr || []).map(String)), [likedArr]);

  // 태그 라벨 i18n
  const tagLabel = useCallback(
    (tag) => t(`tag.${String(tag)}`, { defaultValue: String(tag) }),
    [t]
  );

  // 더미 (i18n 적용)
  const fallback = useMemo(
    () => ([
      { id: '1', name: `${t('sample.user', { defaultValue: '유저' })} A`, age: 28, gender: 'female', tags: ['kind'],   score: 72 },
      { id: '2', name: `${t('sample.user', { defaultValue: '유저' })} B`, age: 31, gender: 'male',   tags: ['calm'],   score: 63 },
      { id: '3', name: `${t('sample.user', { defaultValue: '유저' })} C`, age: 26, gender: 'female', tags: ['active'], score: 81 },
    ]),
    [t]
  );

  // v2 평탄화 or 구형 모두 호환
  const normalized = useMemo(
    () => results.map((r) => (r?.person ? { ...r.person, score: r.score } : r)),
    [results]
  );

  // 점수 내림차순 정렬
  const list = useMemo(() => {
    const base = (normalized.length ? normalized : fallback).slice();
    base.sort((a, b) => (Number(b?.score ?? -1) - Number(a?.score ?? -1)));
    return base;
  }, [normalized, fallback]);

  const keyExtractor = useCallback((item, idx) => String(item?.id ?? idx), []);
  const scoreColor = (s) =>
    s >= 80 ? '#1B873F' : s >= 60 ? '#2962FF' : '#6D6D6D';

  const renderItem = useCallback(({ item }) => {
    const genderLabel =
      item.gender === 'female'
        ? t('label.genderFemale', { defaultValue: '여성' })
        : item.gender === 'male'
        ? t('label.genderMale', { defaultValue: '남성' })
        : t('label.genderOther', { defaultValue: '기타' });

    const liked = likedSet.has(String(item.id));
    const s = Number.isFinite(Number(item.score)) ? Number(item.score) : null;

    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.name}>
            {item.name} {item.age ? `(${item.age})` : ''}
          </Text>
          {liked && <Text style={styles.heart}>♥</Text>}
        </View>

        <Text style={styles.meta}>
          {t('label.gender', { defaultValue: '성별' })}: {genderLabel}
        </Text>

        {Array.isArray(item.tags) && item.tags.length > 0 && (
          <Text style={styles.tags}>#{item.tags.map(tagLabel).join(' #')}</Text>
        )}

        {s != null && (
          <Text style={[styles.score, { color: scoreColor(s) }]}>
            {t('label.score', { defaultValue: '점수' })}: {s}
          </Text>
        )}
      </View>
    );
  }, [t, tagLabel, likedSet]);

  const goResult = useCallback(() => navigation.navigate('Result'), [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.headRow}>
        <Text style={styles.title}>{t('title.matchResult', { defaultValue: '매칭 결과' })}</Text>
        <Pressable style={styles.resultBtn} onPress={goResult}>
          <Text style={styles.resultText}>{t('result.toResult', { defaultValue: '결과 보기' })}</Text>
          <View style={styles.badge}><Text style={styles.badgeText}>{likedArr.length}</Text></View>
        </Pressable>
      </View>

      <FlatList
        data={list}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listPad}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.dim}>{t('result.empty', { defaultValue: '표시할 결과가 없습니다.' })}</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  dim: { color: '#666' },

  container: { flex: 1, padding: 16, backgroundColor: '#f2f2f2' },
  headRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '700' },

  // RN: gap 미지원 → margin 사용
  resultBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#455a64', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  resultText: { color: '#fff', fontWeight: '700', marginRight: 8 },
  badge: { minWidth: 22, height: 22, borderRadius: 11, backgroundColor: '#1976d2', alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '800' },

  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#eee', marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center' },
  name: { fontSize: 16, fontWeight: '700', marginRight: 8 },
  heart: { color: '#e91e63', fontSize: 16, fontWeight: '800' },
  meta: { color: '#666', marginTop: 4 },
  tags: { marginTop: 6, color: '#444' },
  score: { marginTop: 8, fontSize: 14, fontWeight: '700' },

  listPad: { paddingVertical: 8 },
  emptyBox: { alignItems: 'center', paddingVertical: 24 },
});
