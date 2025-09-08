import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { emailSignIn, emailSignUp, resetPassword } from '@/services/auth';
import theme from '@/styles/theme';
import { View, Text, StyleSheet } from 'react-native';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const toErr = e => (e && typeof e === 'object' && 'message' in e ? e.message : String(e));

  const handleLogin = async () => {
    try {
      await emailSignIn(email, password);
      navigation.replace('ProfileSetup');
    } catch (e) { Alert.alert('Login Failed', toErr(e)); }
  };

  const handleSignUp = async () => {
    try {
      await emailSignUp(email, password);
      navigation.replace('ProfileSetup');
    } catch (e) { Alert.alert('SignUp Failed', toErr(e)); }
  };

  const handleResetPassword = async () => {
    try {
      if (!email.trim()) return Alert.alert('Reset', '이메일을 입력하세요');
      await resetPassword(email);
      Alert.alert('Reset', '재설정 메일을 보냈습니다.');
    } catch (e) { Alert.alert('Reset Failed', toErr(e)); }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>크로스</Text>

      <TextInput
        style={styles.input}
        placeholder="email@example.com"
        placeholderTextColor="#889"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="password"
        placeholderTextColor="#889"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={[styles.btn, { backgroundColor: theme.colors.primary }]} onPress={handleLogin}>
        <Text style={styles.btnText}>이메일로 시작하기</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, { borderColor: theme.colors.line, borderWidth: 1 }]} onPress={handleSignUp}>
        <Text style={styles.btnText}>이메일로 회원가입</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleResetPassword}>
        <Text style={{ color: theme.colors.muted, marginTop: 10 }}>비밀번호 재설정</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  btn: { alignItems: 'center', borderRadius: 12, marginTop: 10, paddingVertical: 14 },
  btnText: { color: '#fff', fontWeight: '700' },
  container: { backgroundColor: theme.colors.bg, flex: 1, justifyContent: 'center', padding: 20 },
  input: { backgroundColor: '#141824', borderRadius: 10, color: '#fff', marginBottom: 10, padding: 12 },
  title: { color: '#fff', fontSize: 28, fontWeight: '800', marginBottom: 20, textAlign: 'center' }
});
