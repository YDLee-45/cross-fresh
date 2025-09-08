// src/screens/ResultScreen.jsx
import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from '@react-navigation/native';
import useMatchStore from '../store/matchStore';

import useI18nTitle from '../utils/useI18nTitle';
import { useTranslation } from 'react-i18next';


const formatFilters = (filters) => {
  if (!filters) return '필터: 없음';
  const gender =
    filters.gender === 'male' ? '남성'
    : filters.gender === 'female' ? '여성'
    : '전체';
  const [min, max] = filters.ageRange || [null, null];
  const age = `${min ?? '-'} ~ ${max ?? '-'}세`;
  const tags = Array.isArray(filters.tags) && filters.tags.length
    ? filters.tags.join(', ')
    : '없음';
  return `성별: ${gender} · 나이: ${age} · 태그: ${tags}`;
};

export default function ResultScreen() {

 useI18nTitle('nav.result');
 const { t } = useTranslation();

  const navigation = useNavigation();

  const filters  = useMatchStore((s) => s.filters);
  const likedArr = useMatchStore((s) => s.liked);
  const results  = useMatchStore((s) => s.results);
  const hydrated = useMatchStore((s) => s.hydrated);

  if (!hydrated) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>데이터 불러오는 중...</Text>
      </View>
    );
  }

  const likedIds   = likedArr;
  const likedCount = likedIds.length;
  const filterText = useMemo(() => formatFilters(filters), [filters]);

  // ✅ 통합 텍스트 (좋아요 + 점수)
  const summaryText = useMemo(() => {
    let text = `내 좋아요(${likedCount}명)\nIDs: ${likedIds.join(', ') || '-'}`;
    if (results.length) {
      text += `\n\n매칭 점수 기록:\n`;
      results.forEach((r, i) => {
        text += `${i + 1}. ${r.person.name} (${r.person.age}) → ${r.score}\n`;
      });
    }
    text += `\n\n필터: ${filterText}`;
    return text;
  }, [likedCount, likedIds, results, filterText]);

  const onCopyLink = async () => {
    await Clipboard.setStringAsync(summaryText);
    Alert.alert(t('toast.copied'), t('toast.copiedDetail'));
  };

  const onShareList = async () => {
    await Share.share({ message: summaryText });
  };

  const goHome = () => navigation.navigate('Home');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Result Screen ✅</Text>

      <View style={styles.card}>
        <Text style={styles.metricLabel}>{t('result.likeCount')}</Text>
        <Text style={styles.metricValue}>{likedCount}</Text>

        <Text style={styles.filterLabel}>{t('result.filter')}</Text>
        <Text style={styles.filterValue}>{filterText}</Text>
      </View>

      {results.length > 0 && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>매칭 점수 기록</Text>
          {results.map((r, i) => (
            <Text key={i} style={styles.resultText}>
              {r.person.name} · {r.person.age} → {r.score}
            </Text>
          ))}
        </View>
      )}

      {likedCount === 0 && results.length === 0 && (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>아직 데이터가 없습니다.</Text>
        </View>
      )}

      <View style={styles.btnGroup}>
        <AppButton label={t('ui.copy')} onPress={onCopyLink} disabled={likedCount === 0} />
        <AppButton label={t('ui.share')} onPress={onShareList} disabled={likedCount === 0} />
        <AppButton label="🏠 Home" onPress={goHome} variant="secondary" />
      </View>
    </View>
  );
}

function AppButton({ label, onPress, disabled, variant = 'primary' }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled}
      style={[
        styles.btn,
        variant === 'secondary' && styles.btnSecondary,
        disabled && styles.btnDisabled,
      ]}
    >
      <Text style={[styles.btnText, disabled && styles.btnTextDisabled]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f2f2f2' },
  loading: { fontSize: 16, textAlign: 'center', marginTop: 50, color: '#666' },
  title: { fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 12,
  },
  metricLabel: { fontSize: 13, color: '#666' },
  metricValue: { fontSize: 28, fontWeight: '800', marginTop: 2, marginBottom: 8 },
  filterLabel: { fontSize: 13, color: '#666', marginTop: 8 },
  filterValue: { fontSize: 14, color: '#222', marginTop: 4 },
  resultBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  resultTitle: { fontSize: 15, fontWeight: '700', marginBottom: 6 },
  resultText: { fontSize: 14, color: '#333', marginBottom: 2 },
  emptyBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  emptyText: { textAlign: 'center', color: '#666' },
  btnGroup: { gap: 10 },
  btn: {
    backgroundColor: '#1976d2',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },
  btnSecondary: { backgroundColor: '#455a64' },
  btnDisabled: { backgroundColor: '#c7cdd3' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  btnTextDisabled: { color: '#eef1f4' },
});
