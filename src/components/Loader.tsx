import React from 'react';
import { Modal, View, ActivityIndicator, StyleSheet } from 'react-native';

interface FullscreenLoaderProps {
  visible: boolean;
}

const FullscreenLoader: React.FC<FullscreenLoaderProps> = ({ visible }) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
    >
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FullscreenLoader;
