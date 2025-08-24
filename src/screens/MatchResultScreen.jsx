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

  // 태그 라벨 i18n
  const tagLabel = useCallback(
    (tag) => t(`tag.${String(tag)}`, { defaultValue: String(tag) }),
    [t]
  );

  // 더미 (i18n 적용)
  const fallback = useMemo(() => ([
    { id: '1', name: `${t('sample.user', { defaultValue: '유저' })} A`, age: 28, gender: 'female', tags: ['kind'] },
    { id: '2', name: `${t('sample.user', { defaultValue: '유저' })} B`, age: 31, gender: 'male',   tags: ['calm'] },
    { id: '3', name: `${t('sample.user', { defaultValue: '유저' })} C`, age: 26, gender: 'female', tags: ['active'] },
  ]), [t]);

  // v2 스토어(평탄화된 결과) 혹은 구형(person+score) 모두 호환
  const normalized = useMemo(
    () => results.map((r) => (r?.person ? { ...r.person, score: r.score } : r)),
    [results]
  );

  const list = normalized.length ? normalized : fallback;

  const keyExtractor = useCallback((item) => String(item.id ?? item.name), []);
  const renderItem = useCallback(({ item }) => {
    const genderLabel =
      item.gender === 'female' ? t('label.genderFemale', { defaultValue: '여성' }) :
      item.gender === 'male'   ? t('label.genderMale',   { defaultValue: '남성' }) :
                                 t('label.genderOther',  { defaultValue: '기타' });

    return (
      <View style={styles.card}>
        <Text style={styles.name}>{item.name} ({item.age})</Text>
        <Text style={styles.meta}>
          {t('label.gender', { defaultValue: '성별' })}: {genderLabel}
        </Text>
        {Array.isArray(item.tags) && item.tags.length > 0 && (
          <Text style={styles.tags}>#{item.tags.map((tag) => tagLabel(tag)).join(' #')}</Text>
        )}
      </View>
    );
  }, [t, tagLabel]);

  const goResult = useCallback(() => navigation.navigate('Result'), [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.headRow}>
        <Text style={styles.title}>{t('title.matchResult', { defaultValue: '매칭 결과' })}</Text>
        <Pressable style={styles.resultBtn} onPress={goResult}>
          <Text style={styles.resultText}>{t('result.toResult', { defaultValue: '결과 보기' })}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{likedArr.length}</Text>
          </View>
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

  // ✅ gap 제거하고 marginLeft로 대체
  resultBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#455a64', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  resultText: { color: '#fff', fontWeight: '700', marginRight: 8 },
  badge: { minWidth: 22, height: 22, borderRadius: 11, backgroundColor: '#1976d2', alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '800' },

  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#eee', marginBottom: 10 },
  name: { fontSize: 16, fontWeight: '700' },
  meta: { color: '#666', marginTop: 4 },
  tags: { marginTop: 6, color: '#444' },

  listPad: { paddingVertical: 8 },
  emptyBox: { alignItems: 'center', paddingVertical: 24 },
});
