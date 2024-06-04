import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Assuming you're using Expo for icons

const ListeningModal = ({ visible }: {visible : boolean}) => {
  return (
    <Modal visible={visible} transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <MaterialCommunityIcons name="microphone" size={64} color="white" />
          <Text style={styles.listeningText}>Listening...</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background to overlay on the screen
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FE7C7F',
    borderRadius: 100, // Make the container circular
    padding: 32,
    alignItems: 'center',
  },
  listeningText: {
    marginTop: 16,
    color: 'white',
  },
});

export default ListeningModal;
