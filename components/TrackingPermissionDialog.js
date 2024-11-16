// TrackingPermissionDialog.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as TrackingTransparency from 'expo-tracking-transparency';

const TRACKING_PERMISSION_KEY = '@tracking_permission_shown';

const TrackingPermissionDialog = ({ onResult }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    checkIfShown();
  }, []);

  const checkIfShown = async () => {
    try {
      const hasShown = await AsyncStorage.getItem(TRACKING_PERMISSION_KEY);
      if (!hasShown) {
        setIsVisible(true);
      }
    } catch (error) {
      console.error('Error checking tracking permission status:', error);
    }
  };

  const handleRequestPermission = async () => {
    try {
      const { status } = await TrackingTransparency.requestTrackingPermissionsAsync();
      await AsyncStorage.setItem(TRACKING_PERMISSION_KEY, 'true');
      setIsVisible(false);
      onResult?.(status);
    } catch (error) {
      console.error('Error requesting tracking permission:', error);
    }
  };

  const handleDecline = async () => {
    try {
      await AsyncStorage.setItem(TRACKING_PERMISSION_KEY, 'true');
      setIsVisible(false);
      onResult?.('denied');
    } catch (error) {
      console.error('Error handling decline:', error);
    }
  };

  if (!isVisible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Text style={styles.title}>Help Us Personalize Your Experience</Text>
        
        <View style={styles.messageBox}>
          <Text style={styles.description}>
            We care about making your experience with our app as personalized and relevant as possible.
          </Text>

          <View style={styles.benefitsContainer}>
            <Text style={styles.benefitsTitle}>What this means for you:</Text>
            <Text style={styles.benefitItem}>• More relevant content tailored to your interests</Text>
            <Text style={styles.benefitItem}>• Better app features based on how you use the app</Text>
            <Text style={styles.benefitItem}>• Improved recommendations just for you</Text>
          </View>

          <Text style={styles.privacyNote}>
            You can change this setting anytime in your device settings. We respect your privacy and handle your data with care.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.declineButton]} 
            onPress={handleDecline}
          >
            <Text style={styles.declineButtonText}>Not Now</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.acceptButton]} 
            onPress={handleRequestPermission}
          >
            <Text style={styles.acceptButtonText}>Personalize My Experience</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  messageBox: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
    borderWidth: 1,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    marginBottom: 15,
    color: '#155724',
  },
  benefitsContainer: {
    marginBottom: 15,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#155724',
  },
  benefitItem: {
    fontSize: 14,
    marginBottom: 5,
    color: '#155724',
  },
  privacyNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  declineButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  acceptButton: {
    backgroundColor: '#28a745',
  },
  declineButtonText: {
    color: '#666',
  },
  acceptButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TrackingPermissionDialog;