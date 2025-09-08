import React, { useMemo, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { tSafe } from '@/lib/tSafe';
import InputField from '@/components/InputField';
import CustomButton from '@/components/CustomButton';
import theme from '@/styles/theme';

export default function ProfileSetupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const canNext = useMemo(() => name.trim().length > 0, [name]);

  const onSave = async () => {
    Alert.alert(tSafe('common.confirm'), tSafe('profile.saveSuccess'));
    navigation.replace('MatchStep');
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 16 }}>
        {tSafe('profile.title')}
      </Text>

      <InputField
        label={tSafe('profile.name')}
        placeholder={tSafe('profile.namePlaceholder')}
        value={name}
        onChangeText={setName}
      />
      <InputField
        label={tSafe('profile.bio')}
        placeholder={tSafe('profile.bioPlaceholder')}
        value={bio}
        onChangeText={setBio}
        multiline
        style={{ minHeight: 120 }}
      />

      <CustomButton
        label={tSafe('common.next')}
        onPress={onSave}
        disabled={!canNext}
        type="primary"
        style={{ marginTop: 16, opacity: canNext ? 1 : 0.5 }}
      />
    </View>
  );
}
