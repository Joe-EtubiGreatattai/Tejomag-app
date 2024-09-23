import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Easing,
} from "react-native";

const LanguageSelectionModal = ({ visible, onClose }) => {
  const slideAnim = new Animated.Value(-500);

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -500,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.overlay}>
        <Animated.View style={[styles.modal, { transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.modalTitle}>Language Selection</Text>
          <Text style={styles.comingSoonText}>
            Language selection will be available in future updates. Stay tuned!
          </Text>
          <Text style={styles.featuresList}>
            Upcoming features:
            {'\n'}- Multiple language support
            {'\n'}- Personalized content based on language preference
            {'\n'}- Improved localization
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: 300,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  comingSoonText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
    color: "#666",
  },
  featuresList: {
    fontSize: 14,
    marginBottom: 20,
    color: "#444",
  },
  closeButton: {
    backgroundColor: "#1CAC62",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LanguageSelectionModal;