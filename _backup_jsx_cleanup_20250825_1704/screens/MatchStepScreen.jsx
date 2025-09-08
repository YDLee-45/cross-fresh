// src/screens/MatchStepScreen.jsx
import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, Alert, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import { useTranslation } from 'react-i18next';
import useMatchStore from '../store/matchStore'; // ✅ default import
import LanguageSwitch from '../components/LanguageSwitch';
import { showError } from '../utils/errorKit';
import LoadingOverlay from '../components/LoadingOverlay';

import useI18nTitle from '../utils/useI18nTitle';

const ALL_USERS = [
  { id: 'u1', name: 'Sora',   gender: 'F', age: 24, tags: ['kind','sincere','jp'] },
  { id: 'u2', name: 'Minho',  gender: 'M', age: 29, tags: ['jp','kr','sincere'] },
  { id: 'u3', name: 'Yui',    gender: 'F', age: 33, tags: ['kind','culture'] },
  { id: 'u4', name: 'Daichi', gender: 'M', age: 27, tags: ['jp','kind'] },
];

export default function MatchStepScreen() {

  useI18nTitle('nav.matchStep');
  
  const navigation = useNavigation();
  const { t } = useTranslation();

  // zustand 상태/액션
  const {
    filters, setFilters, setResults,
    saveFilter, loadFilter, savedFilters,
    exportLikedArray, applyLikedFromLink,
  } = useMatchStore();

  const [busy, setBusy] = useState(false);

  const applyPreset = () => setFilters({ gender: 'F', ageRange: [22, 35], tags: ['kind'] });

  const filtered = useMemo(() => {
    const { gender, ageRange, tags } = filters;
    return ALL_USERS.filter((u) => {
      if (gender && u.gender !== gender) return false;
      if (ageRange && (u.age < ageRange[0] || u.age > ageRange[1])) return false;
      if (tags?.length && !tags.every((tx) => u.tags.includes(tx))) return false;
      return true;
    });
  }, [filters]);

  const validate = () => {
    if (!filters.ageRange || filters.ageRange.length !== 2) {
      showError('error.requiredField'); // 나이 범위 누락
      return false;
    }
    if (filters.ageRange[0] > filters.ageRange[1]) {
      showError('error.invalidRange');
      return false;
    }
    return true;
  };

  const startMatch = async () => {
    if (busy) return;
    if (!validate()) return;

    setBusy(true);
    try {
      setResults(filtered);
      Alert.alert(
        t('alert.candidates.title'),
        t('alert.candidates.body', { count: filtered.length }),
        [
          { text: t('alert.cancel') },
          { text: t('alert.ok'), onPress: () => navigation.navigate('Result') },
        ],
      );
    } finally {
      setBusy(false);
    }
  };

  const shareSlot = async (slot) => {
    const saved = savedFilters?.[`slot${slot}`];
    if (!saved) return Alert.alert(t('alert.shareEmpty', { n: slot }));
    await Clipboard.setStringAsync(JSON.stringify(saved));
    Alert.alert(t('alert.copied', { n: slot }));
  };

  const pasteSlot = async () => {
    const str = await Clipboard.getStringAsync();
    if (!str) return Alert.alert(t('alert.pasteEmpty'));
    try {
      const parsed = JSON.parse(str);
      setFilters(parsed);
      Alert.alert(t('alert.ok'));
    } catch {
      Alert.alert(t('alert.pasteInvalid'));
    }
  }; // ✅ 함수 제대로 닫기

  const goToResult = () => {
    // 테스트가 필요하면 아래 한 줄 임시 활성화
    // applyLikedFromLink(['u1','u2']); 

    const ids = exportLikedArray(); // Set -> Array
    navigation.navigate('Result', {
      likedIds: ids,
      likesCount: ids.length,
      filter: filters,
    }); // ✅ 두 번째 인자는 객체
  };

  const SaveLoadRow = ({ slot }) => (
    <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
      <Pressable
        onPress={() => { saveFilter(slot); Alert.alert(t('alert.saved', { n: slot })); }}
        style={{ flex: 1, padding: 10, borderRadius: 10, backgroundColor: '#111' }}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>{t('btn.saveSlot', { n: slot })}</Text>
      </Pressable>

      <Pressable
        onPress={() => {
          const ok = loadFilter(slot);
          if (!ok) Alert.alert(t('alert.loadedEmpty', { n: slot }));
        }}
        style={{ flex: 1, padding: 10, borderRadius: 10, backgroundColor: '#444' }}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>{t('btn.loadSlot', { n: slot })}</Text>
      </Pressable>

      <Pressable
        onPress={() => shareSlot(slot)}
        style={{ flex: 1, padding: 10, borderRadius: 10, backgroundColor: '#007bff' }}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>{t('btn.shareSlot', { n: slot })}</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <LanguageSwitch />
      <Text style={{ fontSize: 20, fontWeight: '700' }}>{t('title.matchStep')}</Text>

      <Text>{t('label.gender')}: {filters.gender ?? '-'}</Text>
      <Text>{t('label.age')}: {filters.ageRange[0]} ~ {filters.ageRange[1]}</Text>
      <Text>{t('label.tags')}: {filters.tags?.join(', ') || '-'}</Text>

      <Pressable onPress={applyPreset} style={{ padding: 12, borderRadius: 12, backgroundColor: '#222', marginTop: 4 }}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>{t('btn.preset')}</Text>
      </Pressable>

      <View style={{ marginTop: 8 }}>
        <Text style={{ marginBottom: 4, fontWeight: '600' }}>{t('saved.title')}</Text>
        <SaveLoadRow slot={1} />
        <SaveLoadRow slot={2} />
        <SaveLoadRow slot={3} />
      </View>

      <View style={{ padding: 20 }}>
  <Button
    title="결과 보기"
    onPress={() => {
      applyLikedFromLink(['u1', 'u2']); // ← 테스트 주입
      goToResult();
    }}
  />
      </View>

      <Pressable onPress={pasteSlot} style={{ marginTop: 12, padding: 12, borderRadius: 12, backgroundColor: '#ff9800' }}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>{t('btn.paste')}</Text>
      </Pressable>

      <Pressable disabled={busy} onPress={startMatch}
        style={{ padding: 14, borderRadius: 14, backgroundColor: busy ? '#999' : '#007bff', marginTop: 12 }}>
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>
          {busy ? '...' : t('btn.startMatch')}
        </Text>
      </Pressable>

      <LoadingOverlay visible={busy} text={t('loading')} />
    </View>
  );
}
