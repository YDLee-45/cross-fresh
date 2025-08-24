import * as Linking from 'expo-linking';

export function buildFilterLink({ gender, ageRange, tags }) {
  const g = gender || '';
  const a = Array.isArray(ageRange) ? `${ageRange[0]}-${ageRange[1]}` : '';
  const t = (tags || []).join(',');
  return `cross://match?g=${encodeURIComponent(g)}&a=${encodeURIComponent(a)}&t=${encodeURIComponent(t)}`;
}

export function parseFilterLink(url) {
  try {
    const { hostname, queryParams } = Linking.parse(url);
    if (hostname !== 'match') return null;
    const g = queryParams?.g || null;
    const a = (queryParams?.a || '').split('-').map(x => parseInt(x,10)).filter(n=>!isNaN(n));
    const t = (queryParams?.t || '').split(',').filter(Boolean);
    return { gender: g || null, ageRange: a.length === 2 ? a : null, tags: t };
  } catch { return null; }
}

export function buildLikedLink(ids = []) {
  return `cross://liked?ids=${encodeURIComponent((ids || []).join(','))}`;
}

export function parseLikedLink(url) {
  try {
    const { hostname, queryParams } = Linking.parse(url);
    if (hostname !== 'liked') return null;
    const ids = (queryParams?.ids || '').split(',').filter(Boolean);
    return ids;
  } catch { return null; }
}
