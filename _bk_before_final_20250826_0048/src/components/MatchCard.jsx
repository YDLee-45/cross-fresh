import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import useMatchStore from '../store/matchStore';

export default function MatchCard({ user }) {
  const toggleLike = useMatchStore((s) => s.toggleLike);
  const likedArr   = useMatchStore((s) => s.liked);

  // store는 문자열로 저장 → 비교도 문자열
  const id = String(user.id);
  const isLiked = useMemo(() => likedArr.includes(id), [likedArr, id]);

  const onLike = () => {
    toggleLike(id);
  };

  return (
    <View style={styles.card}>
      {/* 썸네일 (없으면 회색 박스) */}
      {user.photo ? (
        <Image source={{ uri: user.photo }} style={styles.photo} />
      ) : (
        <View style={[styles.photo, styles.photoPlaceholder]}>
          <Text style={{ color:'#999' }}>No Image</Text>
        </View>
      )}

      {/* 텍스트 영역 */}
      <View style={styles.info}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.meta}>
          {user.age}세 · {user.gender === 'male' ? '남성' : user.gender === 'female' ? '여성' : '기타'}
        </Text>
        {Array.isArray(user.tags) && user.tags.length > 0 && (
          <Text style={styles.tags}>#{user.tags.join(' #')}</Text>
        )}
      </View>

      {/* 좋아요 버튼 (항상 우측 하단에 보이도록 절대배치) */}
      <TouchableOpacity onPress={onLike} activeOpacity={0.85} style={[styles.likeBtn, isLiked && styles.likeBtnOn]}>
        <Text style={styles.likeText}>{isLiked ? '❤️' : '🤍'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 12,
  },
  photo: { width: '100%', height: 180, backgroundColor: '#ddd' },
  photoPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  info: { padding: 12 },
  name: { fontSize: 16, fontWeight: '700' },
  meta: { color: '#666', marginTop: 2 },
  tags: { marginTop: 6, color: '#444' },

  likeBtn: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffffee',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  likeBtnOn: {
    backgroundColor: '#ffe3ec',
    borderColor: '#ffc0d2',
  },
  likeText: { fontSize: 20 },
});
