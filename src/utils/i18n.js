// src/utils/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// (선택) OS 언어 감지 원하면 주석 해제
// import * as Localization from 'expo-localization';

import ko from '../locales/ko.json';
import ja from '../locales/ja.json';
import en from '../locales/en.json';

const resources = { ko: { translation: ko }, ja: { translation: ja }, en: { translation: en } };

i18n
  .use(initReactI18next)
  .init({
    resources,
    // 기본 언어: 필요에 맞게 바꾸세요
    lng: 'ko',
    fallbackLng: 'en',
    compatibilityJSON: 'v3',
    interpolation: { escapeValue: false },
  });

export default i18n;
