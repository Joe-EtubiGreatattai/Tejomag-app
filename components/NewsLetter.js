import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import translateText from "../ult/TranslationService";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false); // Track subscription status
  const [translations, setTranslations] = useState({
    title: "Get top stories in your inbox.",
    subtitle: "Subscribe to our newsletter for fresh headlines every morning.",
    placeholderEmail: "Email address",
    buttonText: "Sign Up",
    successMessage: "You've successfully signed up for our newsletter!",
    unsubscribeMessage: "You have unsubscribed from the newsletter.",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [fontsLoaded] = useFonts({
    "NotoSerifCondensed-Bold": require("../assets/fonts/static/NotoSerif_Condensed-ExtraBold.ttf"),
  });

  useEffect(() => {
    const fetchTranslations = async () => {
      setIsLoading(true);
      try {
        const storedLanguage =
          (await AsyncStorage.getItem("selectedLanguage")) || DEFAULT_LANGUAGE;

        const translationKeys = Object.keys(translations);
        const updatedTranslations = {};
        for (const key of translationKeys) {
          updatedTranslations[key] = await translateText(translations[key]);
        }
        setTranslations(updatedTranslations);

        // Fetch subscription status from AsyncStorage
        const storedSubscriptionStatus = await AsyncStorage.getItem(
          "isSubscribed"
        );
        if (storedSubscriptionStatus === "true") {
          setIsSubscribed(true);
        }
      } catch (error) {
        console.error("Error fetching translations or subscription status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranslations();
  }, []);

  if (!fontsLoaded || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1F6CAE" />
        <Text style={styles.loadingText}>Please wait...</Text>
      </View>
    );
  }

  const handleSubscribeToggle = async () => {
    try {
      if (isSubscribed) {
        // Unsubscribe logic
        await AsyncStorage.setItem("isSubscribed", "false");
        setIsSubscribed(false);
        Alert.alert("Success", translations.unsubscribeMessage);
      } else {
        // Subscribe logic
        if (!email) {
          Alert.alert("Error", "Please enter your email address");
          return;
        }
        setIsSubmitting(true);

        await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulated delay

        await AsyncStorage.setItem("isSubscribed", "true");
        setIsSubscribed(true);
        setIsSuccess(true);
        setEmail(""); // Clear the email input
        Alert.alert("Success", translations.successMessage);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update subscription. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>{translations.title}</Text>
          <Text style={styles.subtitle}>{translations.subtitle}</Text>
          {isSubscribed ? (
            <Text style={styles.successMessage}>
              {translations.successMessage}
            </Text>
          ) : null}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={24}
                color="white"
                style={styles.emailIcon}
              />
              <TextInput
                style={styles.input}
                placeholder={translations.placeholderEmail}
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#ccc"
                editable={!isSubmitting && !isSubscribed} // Disable input if subscribed
              />
            </View>
            <TouchableOpacity
              style={[
                styles.button,
                isSubmitting && styles.disabledButton,
              ]}
              onPress={handleSubscribeToggle}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#777" />
              ) : (
                <Text style={styles.buttonText}>
                  {isSubscribed
                    ? "Unsubscribe"
                    : translations.buttonText}
                </Text>
              )}
            </TouchableOpacity>
          </View>
          {/* Subscription Switch */}
          {isSubscribed && (
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Subscribed</Text>
              <Switch
                value={isSubscribed}
                onValueChange={handleSubscribeToggle}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: "#333",
    padding: 20,
    width: Dimensions.get("window").width - 40,
    marginVertical: 30,
  },
  title: {
    fontSize: 24,
    fontFamily: "NotoSerifCondensed-Bold",
    textAlign: "center",
    marginBottom: 10,
    color: "white",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "white",
  },
  form: {
    flexDirection: "column",
  },
  inputContainer: {
    position: "relative",
    marginBottom: 10,
  },
  emailIcon: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  input: {
    width: "100%",
    padding: 12,
    paddingLeft: 40,
    fontSize: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    color: "white",
  },
  button: {
    backgroundColor: "#E0E0E0",
    padding: 12,
    borderRadius: 104,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    color: "#777",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#fff",
  },
  successMessage: {
    fontSize: 18,
    color: "#4CAF50",
    textAlign: "center",
    marginTop: 20,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    justifyContent: "center",
  },
  switchLabel: {
    fontSize: 16,
    color: "white",
    marginRight: 10,
  },
});

export default NewsletterSignup;
