import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet } from 'react-native';

const LoadingOverlay = ({ visible, text }) => {
  const { t } = useTranslation();

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.text}>
            {text || t('loading')}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center'
  },
  text: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16
  }
});

export default LoadingOverlay;
