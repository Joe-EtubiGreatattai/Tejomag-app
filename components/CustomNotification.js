import React, { useEffect } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions , Platform} from 'react-native';
import { Ionicons } from "@expo/vector-icons";

const CustomNotification = ({ visible, type, message, onHide }) => {
  const translateY = new Animated.Value(-100);

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(1000),
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (onHide) onHide();
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY }] },
        type === 'success' ? styles.successContainer : styles.errorContainer,
      ]}
    >
      <View style={styles.content}>
        <Ionicons
          name={type === 'success' ? 'checkmark-circle' : 'alert-circle'}
          size={24}
          color="#fff"
          style={styles.icon}
        />
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    width: '100%',
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 20,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  successContainer: {
    backgroundColor: '#4CAF50',
  },
  errorContainer: {
    backgroundColor: '#F44336',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  icon: {
    marginRight: 12,
  },
  message: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
    fontWeight: '500',
    lineHeight: 20,
  },
});

export default CustomNotification;