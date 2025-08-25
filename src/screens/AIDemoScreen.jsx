import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, FlatList } from 'react-native';
import CustomButton from '@/components/CustomButton';
import theme from '@/styles/theme';
import useI18nTitle from '@/utils/useI18nTitle';
import { aiTranslate, aiQuickReplies, aiMatchScore } from '@/services/ai';
import InputField from '@/components/InputField'   // (InputField가 기본 export일 때)

export default function AIDemoScreen() {
  useI18nTitle('nav.aiDemo'); // i18n 키가 없으면 무시돼도 무해

  const [text, setText] = useState('안녕하세요!');
  const [tLoading, setTLoading] = useState(false);
  const [qLoading, setQLoading] = useState(false);
  const [translated, setTranslated] = useState('');
  const [replies, setReplies] = useState([]);

  const onTranslate = useCallback(async () => {
    if (!text.trim()) return;
    setTLoading(true);
    setTranslated('');
    try {
      const res = await aiTranslate(text, { to: 'ja' });
      // 서버 응답 모양에 따라 유연하게 받기
      const out =
        res?.text ??
        res?.translation ??
        res?.data?.text ??
        res?.data?.translation ??
        '';
      setTranslated(String(out));
    } catch (e) {
      Alert.alert('번역 실패', String(e?.message || e));
    } finally {
      setTLoading(false);
    }
  }, [text]);

  const onQuick = useCallback(async () => {
    setQLoading(true);
    setReplies([]);
    try {
      const res = await aiQuickReplies(text);
      const list =
        res?.replies ??
        res?.choices ??
        res?.data?.replies ??
        res?.data?.choices ??
        [];
      setReplies(Array.isArray(list) ? list.map(String) : []);
    } catch (e) {
      Alert.alert('불러오기 실패', String(e?.message || e));
    } finally {
      setQLoading(false);
    }
  }, [text]);

  return (
    <View style={s.container}>
      <Text style={s.h1}>AI Demo (oss-20b 스캐폴드 점검)</Text>

      {/* 번역 데모 */}
      <Text style={s.section}>번역 데모</Text>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="번역할 문장을 입력하세요"
        style={s.input}
      />
      <CustomButton
        label={tLoading ? '번역 중...' : 'AI 번역(ja)'}
        onPress={onTranslate}
        disabled={tLoading}
      />
      {!!translated && (
        <View style={s.box}>
          <Text style={s.boxTitle}>결과</Text>
          <Text style={s.boxText}>{translated}</Text>
        </View>
      )}

      {/* 빠른 답장 데모 */}
      <Text style={[s.section, { marginTop: 24 }]}>빠른 답장 데모</Text>
      <CustomButton
        label={qLoading ? '불러오는 중...' : '추천 불러오기'}
        onPress={onQuick}
        disabled={qLoading}
        variant="secondary"
      />

      <FlatList
        style={{ marginTop: 10 }}
        data={replies}
        keyExtractor={(item, idx) => `${idx}-${item}`}
        renderItem={({ item }) => <Text style={s.reply}>• {item}</Text>}
        ListEmptyComponent={
          !qLoading && <Text style={s.dim}>추천이 아직 없습니다.</Text>
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg ?? '#f2f2f2', padding: 16 },
  h1: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  section: { fontSize: 14, fontWeight: '700', marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 10,
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
    marginTop: 10,
  },
  boxTitle: { fontWeight: '700', marginBottom: 6 },
  boxText: { color: '#222' },
  reply: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 8,
    color: '#222',
  },
  dim: { textAlign: 'center', color: '#888', marginTop: 8 },
});
