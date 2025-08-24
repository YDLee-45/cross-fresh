// i18n 안전 래퍼: 키 없을 때 앱이 죽지 않도록 ko로 폴백 + 경고 로그
import i18n from '../utils/i18n';

export type TOpts = {
  lng?: string;
  defaultValue?: string;
  [k: string]: any;
};

export const tSafe = (key: string, opts: TOpts = {}) => {
  try {
    // i18next.exists(key) 사용 (버전에 따라 hasResource로 대체 가능)
    // @ts-ignore
    const exists = typeof i18n.exists === 'function'
      // @ts-ignore
      ? i18n.exists(key, opts)
      // @ts-ignore
      : i18n.hasResource?.(opts.lng || i18n.language, key);

    if (!exists) {
      // 누락키 로그(선택): 콘솔 또는 서버 수집
      // eslint-disable-next-line no-console
      console.warn(`[i18n] missing key: ${key}`);
      const merged = { ...opts, lng: opts.lng || 'ko', defaultValue: opts.defaultValue || key };
      // @ts-ignore
      return i18n.t(key, merged);
    }
    // @ts-ignore
    return i18n.t(key, opts);
  } catch (e) {
    // 예외 상황에도 앱은 계속
    // eslint-disable-next-line no-console
    console.error(`[i18n] error at key "${key}":`, e);
    // @ts-ignore
    return i18n.t(key, { ...opts, lng: 'ko', defaultValue: key });
  }
};
