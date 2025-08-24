import { Alert } from 'react-native';
import i18n from './i18n';

// 표준 에러 표시
export function showError(key = 'error.unknown', params) {
  Alert.alert(i18n.t(key, params));
}

// 네트워크/HTTP/기타 에러 → 메시지 키 변환
export function mapError(err) {
  if (!err) return 'error.unknown';
  // axios/fetch 네트워크 오류
  if (err.message?.includes('Network') || err.name === 'TypeError') {
    return 'error.network';
  }
  // 서버가 보낸 도메인 에러코드가 있다면 우선
  const code = err.code || err?.response?.data?.code;
  if (code && typeof code === 'string') {
    // 예: error.requiredField 처럼 바로 키를 주면 그대로 사용
    if (code.startsWith('error.')) return code;
  }
  return 'error.unknown';
}

// 한번에 처리
export function handleError(err) {
  const key = mapError(err);
  showError(key);
}
