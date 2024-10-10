import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Switch } from "react-native-switch";
import Divider from "../components/Divider";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LanguageSelectionModal from "./../components/LanguageSelectionModal";
import translateText from "../ult/TranslationService";
import { useAuth } from "./../navigation/OnboardingNavigator";
import axios from "axios";

const SettingsPage = () => {
  const [notifications, setNotifications] = useState(false);
  const [email, setEmail] = useState("");
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [translatedTexts, setTranslatedTexts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [bearerToken, setBearerToken] = useState("");
  const navigation = useNavigation();
  const { logout } = useAuth();

  let [fontsLoaded] = useFonts({
    "NotoSerifCondensed-Regular": require("../assets/fonts/static/NotoSerif_Condensed-Regular.ttf"),
    "NotoSerifCondensed-Bold": require("../assets/fonts/static/NotoSerif_Condensed-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          setBearerToken(token);
        } else {
          console.error("No token found");
          Alert.alert("Error", "Authentication token not available.");
        }
      } catch (error) {
        console.error("Error retrieving token:", error);
        Alert.alert("Error", "Authentication token not available.");
      }
    };

    getToken();
  }, []);

  useEffect(() => {
    const initializeSettings = async () => {
      try {
        await fetchUserEmail();
        await translateContent();
        if (bearerToken) {
          await fetchNotificationStatus();
        }
      } catch (error) {
        console.error("Error initializing settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSettings();
  }, [bearerToken]);

  const fetchUserEmail = async () => {
    try {
      const userInfo = await AsyncStorage.getItem("userInfo");
      if (userInfo) {
        const user = JSON.parse(userInfo);
        setEmail(user.email || "");
      }
    } catch (error) {
      console.error("Error fetching user email:", error);
    }
  };

  const translateContent = async () => {
    const keysToTranslate = [
      "Your Info",
      "Logout",
      "Settings",
      "Notifications",
      "Language",
      "Notification Preferences",
      "Legal",
      "Terms of Use & Privacy Policy",
      "About",
    ];

    const translations = {};
    for (let key of keysToTranslate) {
      translations[key] = await translateText(key);
    }
    setTranslatedTexts(translations);
  };

  const fetchNotificationStatus = async () => {
    try {
      const userExpoToken = await AsyncStorage.getItem("userExpoToken");
      if (!userExpoToken) {
        throw new Error("User Expo token not found");
      }

      const response = await axios.get(
        `https://tejomag.com/wp-json/tejo-mag/v1/notification?expo_token=${userExpoToken}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );

      if (response.data.status === "success") {
        setNotifications(response.data.data.status === "true");
      } else {
        throw new Error("Failed to fetch notification status");
      }
    } catch (error) {
      console.error("Error fetching notification status:", error);
      Alert.alert(
        "Error",
        "Failed to fetch notification status. Please try again later."
      );
    }
  };

  const handleLogout = async () => {
    logout();
  };

  const toggleNotifications = async () => {
    const newValue = !notifications;
    const currentStatus = notifications ? "on" : "off";
    const newStatus = newValue ? "on" : "off";

    Alert.alert(
      "Notification Settings",
      `Your notifications are currently ${currentStatus}. Would you like to turn them ${newStatus}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Yes, change it",
          onPress: () => updateNotificationStatus(newValue)
        }
      ]
    );
  };

  const updateNotificationStatus = async (newValue) => {
    setIsLoading(true);
    try {
      const userExpoToken = await AsyncStorage.getItem("userExpoToken");

      if (!bearerToken || !userExpoToken) {
        throw new Error("User token or Expo token not found");
      }

      const apiData = {
        status: newValue ? "true" : "false",
        expo_token: userExpoToken,
      };

      const response = await axios.post(
        "https://tejomag.com/wp-json/tejo-mag/v1/toggle-expo-token",
        apiData,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        if (response.data.message === "Notification status not changed") {
          Alert.alert(
            "No Change Needed",
            "Your notification settings are already up to date. No changes were made.",
            [{ text: "OK" }]
          );
        } else {
          setNotifications(newValue);
          Alert.alert(
            "Success",
            `Your notification settings have been updated. Notifications are now ${newValue ? "on" : "off"}.`,
            [{ text: "OK" }]
          );
        }
      } else {
        throw new Error("Failed to update notification settings");
      }
    } catch (error) {
      console.error("Error updating notifications:", error.message);
      if (error.response) {
        console.error(
          "API Error Response:",
          JSON.stringify(error.response.data, null, 2)
        );
      }
      Alert.alert(
        "Update Failed",
        "We couldn't update your notification settings at the moment. Please try again later.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!fontsLoaded || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Text style={[styles.title, { fontFamily: "NotoSerifCondensed-Bold" }]}>
        {translatedTexts["Your Info"] || "Your Info"}
      </Text>

      <View style={styles.userInfo}>
        <Ionicons name="person-outline" size={16} color="#333" />
        <Text style={styles.email}>{email}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons
          name="log-out-outline"
          size={24}
          color="#fff"
          style={styles.logoutIcon}
        />
        <Text style={styles.logoutText}>
          {translatedTexts["Logout"] || "Logout"}
        </Text>
      </TouchableOpacity>

      <Divider color="#999" thickness={1} />
      <Text style={styles.sectionTitle}>
        {translatedTexts["Settings"] || "Settings"}
      </Text>
      <TouchableOpacity
        style={styles.settingItem}
        onPress={toggleNotifications}
        disabled={isLoading}
      >
        <View style={styles.settingLeft}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
          <Text style={styles.settingText}>
            {translatedTexts["Notifications"] || "Notifications"}
          </Text>
        </View>
        {isLoading ? (
          <ActivityIndicator size="small" color="#1976d2" />
        ) : (
          <Switch
            value={notifications}
            onValueChange={toggleNotifications}
            circleSize={20}
            barHeight={25}
            circleBorderWidth={0}
            backgroundActive="#1976d2"
            backgroundInactive="#ccc"
            circleActiveColor="#fff"
            circleInActiveColor="#fff"
            switchLeftPx={2}
            switchRightPx={2}
            switchWidthMultiplier={2}
            disabled={isLoading}
          />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.settingItem}
        onPress={() => setShowLanguageModal(true)}
      >
        <View style={styles.settingLeft}>
          <Ionicons name="language-outline" size={24} color="#333" />
          <Text style={styles.settingText}>
            {translatedTexts["Language"] || "Language"}
          </Text>
        </View>
        <Ionicons name="chevron-forward-outline" size={24} color="#333" />
      </TouchableOpacity>

      <Divider color="#999" thickness={1} />
      <Text style={styles.sectionTitle}>
        {translatedTexts["Legal"] || "Legal"}
      </Text>
      <TouchableOpacity
        style={styles.settingItem}
        onPress={() => navigation.navigate("TermsOfUse")}
      >
        <View style={styles.settingLeft}>
          <Ionicons name="shield" size={24} color="#333" />
          <Text style={styles.settingText}>
            {translatedTexts["Terms of Use & Privacy Policy"] ||
              "Terms of Use & Privacy Policy"}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.settingItem}
        onPress={() => navigation.navigate("Aboutus")}
      >
        <View style={styles.settingLeft}>
          <Ionicons name="information-circle-outline" size={24} color="#333" />
          <Text style={styles.settingText}>
            {translatedTexts["About"] || "About"}
          </Text>
        </View>
      </TouchableOpacity>
      <LanguageSelectionModal
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "95%",
    padding: 10,
    marginHorizontal: "auto",
    paddingVertical: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "bold",
    marginBottom: 35,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    marginLeft: 20,
    color: "#404040",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 10,
    backgroundColor: "#1976d2",
    borderRadius: 100,
    marginBottom: 30,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    marginTop: 10,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    fontSize: 16,
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SettingsPage;