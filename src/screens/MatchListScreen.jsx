import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import theme from '@/styles/theme';
import { MOCK_USERS } from '@/utils/constants'; // 없으면 아래 dummy 쓰면 됨.


export default function MatchListScreen({ navigation, route }) {
  // step 화면에서 넘어온 필터 결과가 있으면 사용
  const filtered = route?.params?.filtered;
  const data = Array.isArray(filtered) && filtered.length ? filtered : (MOCK_USERS || DUMMY);

  const openProfile = (item) => navigation.navigate('Swipe', { from: 'MatchList', user: item });

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => openProfile(item)}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name} · {item.age}</Text>
        <Text style={styles.sub}>{item.region} · {item.job}</Text>
        <Text numberOfLines={1} style={styles.tags}>{(item.tags || []).join(' · ')}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>매칭 목록</Text>
      <FlatList
        data={data}
        keyExtractor={(it, i) => String(it.id ?? i)}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  title: {
    color: theme.colors.text, fontSize: 22, fontWeight: '800',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 6
  },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#141824', borderRadius: 14, padding: 12, gap: 12
  },
  avatar: { width: 56, height: 56, borderRadius: 12, backgroundColor: '#222' },
  name: { color: theme.colors.text, fontSize: 16, fontWeight: '700' },
  sub: { color: theme.colors.muted, marginTop: 2, marginBottom: 4 },
  tags: { color: theme.colors.muted }
});

// 임시 데이터 (MOCK_USERS 없으면 사용)
const DUMMY = [
  { id: 1, name: 'Sora', age: 28, region: 'Tokyo', job: 'Designer', avatar: 'https://i.pravatar.cc/150?img=1', tags: ['여행', '커피'] },
  { id: 2, name: '민수', age: 31, region: 'Seoul', job: 'Dev', avatar: 'https://i.pravatar.cc/150?img=2', tags: ['러닝', '독서'] },
  { id: 3, name: 'Yuki', age: 26, region: 'Osaka', job: 'Chef', avatar: 'https://i.pravatar.cc/150?img=3', tags: ['요리', '영화'] },
];
