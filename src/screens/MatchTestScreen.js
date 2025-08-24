// src/screens/MatchTestScreen.jsx
import React, { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import useI18nTitle from '../utils/useI18nTitle';
import { aiMatchScore } from '../lib/ai';

export default function MatchTestScreen() {
  useI18nTitle('nav.matchTest');
  const { t } = useTranslation();

  const [status, setStatus] = useState('IDLE');
  const [score, setScore] = useState(null);

  const run = async () => {
    try {
      setStatus('RUN');
      const a = { age: 30, hobby: ['hiking', 'movie'] };
      const b = { age: 32, hobby: ['movie', 'cooking'] };
      const res = await aiMatchScore(a, b);
      setScore(res?.score ?? null);
      setStatus('DONE');
    } catch (e) {
      setStatus('ERR');
    }
  };

  return (
    <View style={s.root}>
      <Text style={s.title}>{t('matchTest.title', { defaultValue: 'Match Score 테스트' })}</Text>

      <Text style={s.label}>
        {t('matchTest.inputA', { defaultValue: '입력 A:' })}{' '}
        {`{ "age":30, "hobby":["hiking","movie"] }`}
      </Text>
      <Text style={s.label}>
        {t('matchTest.inputB', { defaultValue: '입력 B:' })}{' '}
        {`{ "age":32, "hobby":["movie","cooking"] }`}
      </Text>

      <Pressable style={s.btn} onPress={run}>
        <Text style={s.btnText}>{t('matchTest.calculating', { defaultValue: '계산 중...' })}</Text>
      </Pressable>

      {status === 'RUN' && <ActivityIndicator style={{ marginTop: 10 }} />}
      {score != null && <Text style={s.out}>score: {score}</Text>}

      <Text style={s.state}>
        {t('matchTest.status', { defaultValue: '상태' })}: {status}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, padding: 16, backgroundColor: '#f2f2f2' },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  label: { color: '#333', marginBottom: 6 },
  btn: { marginTop: 10, padding: 12, borderRadius: 10, backgroundColor: '#1f6feb' },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
  out: { marginTop: 12, fontSize: 16, fontWeight: '700' },
  state: { marginTop: 8, color: '#666' },
});
