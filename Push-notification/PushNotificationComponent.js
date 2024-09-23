import React, { useState, useEffect, useRef } from "react";
import { Platform, StyleSheet } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants"; 
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBFBfdm_l7GSwo-xH5zSdtXm1lm8ZMU5bg",
  authDomain: "tejomag-1866f.firebaseapp.com",
  projectId: "tejomag-1866f",
  storageBucket: "tejomag-1866f.appspot.com",
  messagingSenderId: "119259371504",
  appId: "1:119259371504:android:b1ed72c44ea23db523ef35",

};

const app = initializeApp(firebaseConfig);


// Set default notification handler
Notifications.setNotificationHandler({
  handleNotification: async (notification) => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    ...notification.request.content,
  }),
});


// Function to handle registration errors
const handleRegistrationError = (message) => {
  alert(message);
  throw new Error(message);
};

// Function to register for push notifications
const registerForPushNotificationsAsync = async () => {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
       finalStatus = status;
    }
    if (finalStatus !== "granted") {
      handleRegistrationError("Permission not granted for push notifications.");
        return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    if (!projectId) {
      handleRegistrationError("Project ID not found.");
      return;
    }
    try {
      const { data: pushTokenString } =
        await Notifications.getExpoPushTokenAsync({ projectId });
    return pushTokenString;
    } catch (error) {
      handleRegistrationError(`Error getting push token: ${error}`);
    }
  } else {
    handleRegistrationError("Physical device required for push notifications.");
  }
};

// Push Notification Component
const PushNotificationComponent = ({ navigation }) => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(null);
  const notificationListener = useRef(null);
  const responseListener = useRef(null);

  useEffect(() => {
    // Register for push notifications and set token
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token || ""))
      .catch((error) => setExpoPushToken(`Error: ${error}`));

    // Add notification received listener
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // Add notification response listener
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const articleId = response.notification.request.content.data.articleId;
        if (articleId && navigation) {
          navigation.navigate('ArticlePage', { articleId });
        }
      });

    // Clean up listeners on component unmount
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [navigation]);

  return null;
};

export default PushNotificationComponent;