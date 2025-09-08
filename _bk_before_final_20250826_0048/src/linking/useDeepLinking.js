import { useEffect } from 'react';
import * as Linking from 'expo-linking';

function parseQuery(queryString) {
  const params = {};
  for (const part of queryString.split('&')) {
    if (!part) continue;
    const [k, v] = part.split('=');
    params[decodeURIComponent(k)] = decodeURIComponent(v ?? '');
  }
  return params;
}

export default function useDeepLinking({ applyFilter, applyLiked }) {
  useEffect(() => {
    const handleUrl = (url) => {
      try {
        const parsed = Linking.parse(url); // { scheme, hostname, path, queryParams }
        // cross://likes?ids=1,2,3
        // cross://match?gender=f&age=22-35&tags=kind,calm
        const host = parsed.hostname || parsed.path || ''; // Android/iOS 차이 커버
        const qp = parsed.queryParams ?? {};

        if (host.includes('likes')) {
          const ids = qp.ids || qp.id || '';
          applyLiked(ids);
        } else if (host.includes('match')) {
          const payload = {
            gender: qp.gender ?? qp.g,
            ageRange: qp.age ?? qp.range,  // "22-35"
            ageMin: qp.min ? Number(qp.min) : undefined,
            ageMax: qp.max ? Number(qp.max) : undefined,
            tags: qp.tags ? String(qp.tags).split(',').map(s => s.trim()).filter(Boolean) : undefined,
            tag: qp.tag,
          };
          applyFilter(payload);
        }
      } catch (e) {
        console.warn('[Linking] parse error:', e?.message);
      }
    };

    // 콜드스타트
    (async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) handleUrl(initialUrl);
    })();

    // 런타임
    const sub = Linking.addEventListener('url', (e) => handleUrl(e.url));
    return () => sub.remove();
  }, [applyFilter, applyLiked]);
}
