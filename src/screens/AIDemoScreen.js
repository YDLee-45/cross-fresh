// src/screens/AIDemoScreen.jsx
import React, { useRef, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import InputField from '@/components/InputField';
import CustomButton from '@/components/CustomButton';
import { aiTranslate, aiQuickReplies } from '@/services/ai';
import { AI_TIMEOUT_MS } from '@/config/aiConfig';
import theme from '@/styles/theme';

export default function AIDemoScreen() {
  const [text, setText] = useState('안녕하세요!');
  const [tLoading, setTLoading] = useState(false);
  const [qLoading, setQLoading] = useState(false);
  const [translated, setTranslated] = useState('');
  const [replies, setReplies] = useState([]);

  // 요청 중복/지연 응답 방지용 ID
  const transReqId = useRef(0);
  const quickReqId = useRef(0);

  const onTranslatePress = async () => {
    const myId = ++transReqId.current;
    setTLoading(true);

    try {
      const out = await withTimeout(
        aiTranslate(text, { to: 'ja' }),
        Math.max(30000, AI_TIMEOUT_MS || 0)
      );

      if (myId !== transReqId.current) return; // 오래된 응답 무시
      setTranslated(String(out ?? ''));
    } catch (e) {
      if (myId !== transReqId.current) return;
      console.warn('[AIDemo] translate error => fallback', e);
      setTranslated(`[ja] ${String(text ?? '')}`); // 최종 폴백
    } finally {
      if (myId === transReqId.current) setTLoading(false);
    }
  };

  const onQuickRepliesPress = async () => {
    const myId = ++quickReqId.current;
    setQLoading(true);

    try {
      const out = await withTimeout(
        aiQuickReplies(text || ''),
        Math.max(30000, AI_TIMEOUT_MS || 0)
      );

      if (myId !== quickReqId.current) return;

      const list =
        Array.isArray(out) ? out.map(String)
        : Array.isArray(out?.suggestions) ? out.suggestions.map(String)
        : Array.isArray(out?.choices) ? out.choices.map(String)
        : [];

      setReplies(
        list.length ? list : ['첫 만남 반가워요! 😊', '관심사가 궁금해요!', '주말엔 뭐 하세요?']
      );
    } catch (e) {
      if (myId !== quickReqId.current) return;
      console.warn('[AIDemo] quick replies error => fallback', e);
      setReplies(['첫 만남 반가워요! 😊', '관심사가 궁금해요!', '주말엔 뭐 하세요?']);
    } finally {
      if (myId === quickReqId.current) setQLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.bg }} contentContainerStyle={{ padding: 16 }}>
      <Text style={{ color: '#fff', fontSize: 18, fontWeight: '800', marginBottom: 12 }}>
        AI Demo (oss-20b 스캐폴드 점검)
      </Text>

      {/* 번역 데모 */}
      <Text style={{ color: '#9aa4b2', marginBottom: 6 }}>번역 데모</Text>
      <InputField value={text} onChangeText={setText} placeholder="입력…" />
      <CustomButton
        label={tLoading ? '번역 중…' : 'AI 번역(ja)'}
        disabled={tLoading}
        onPress={onTranslatePress}
        style={{ marginTop: 8 }}
      />
      {!!translated && (
        <Text style={{ color: '#cfd8dc', marginTop: 8 }}>→ {translated}</Text>
      )}

      {/* 빠른 답장 데모 */}
      <Text style={{ color: '#9aa4b2', marginTop: 24, marginBottom: 6 }}>빠른 답장 데모</Text>
      <CustomButton
        label={qLoading ? '불러오는 중…' : '추천 불러오기'}
        disabled={qLoading}
        onPress={onQuickRepliesPress}
      />
      {replies.length === 0 ? (
        <Text style={{ color: '#718096', marginTop: 8 }}>
          (아직 로드 전입니다. ‘추천 불러오기’를 눌러보세요)
        </Text>
      ) : (
        <View style={{ marginTop: 8 }}>
          {replies.map((r, i) => (
            <Text key={`${i}-${r}`} style={{ color: '#cfd8dc', marginTop: 4 }}>• {r}</Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

// 간단 타임아웃 헬퍼
const withTimeout = (p, ms) =>
  Promise.race([
    p,
    new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms)),
  ]);
