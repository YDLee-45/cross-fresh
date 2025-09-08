import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';

const LoadingOverlay = ({ visible, text }) => {
  const { t } = useTranslation();
  const label = text ?? t?.('loading') ?? 'Loading...';

  return (
    <Modal transparent visible={!!visible} animationType="fade" onRequestClose={() => {}}>
      <View style={styles.backdrop}>
        <View style={styles.box}>
          <ActivityIndicator size="large" />
          <Text style={styles.label}>{label}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' },
  box: { minWidth: 160, backgroundColor: '#111827', borderRadius: 12, padding: 16, alignItems: 'center' },
  label: { marginTop: 8, color: '#fff', fontWeight: '700' },
});

export default LoadingOverlay;
