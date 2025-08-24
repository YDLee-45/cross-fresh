import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

/** 헤더 타이틀을 i18n으로 자동 반영 (언어 변경 시 즉시 갱신) */
export default function useI18nTitle(key, opts) {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({ title: t(key, opts) });
  }, [navigation, i18n.language, key, JSON.stringify(opts || {})]);
}
