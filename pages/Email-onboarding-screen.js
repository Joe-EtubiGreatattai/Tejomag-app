import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import translateText from "./../ult/TranslationService"; // Import the translateText function

const DEFAULT_LANGUAGE = "pt-BR"; // Portuguese (Brazil)

export default function EmailEntryScreen() {
  const [email, setEmail] = useState("");
  const navigation = useNavigation();

  // Load custom fonts
  const [fontsLoaded] = useFonts({
    "NotoSerifCondensed-Regular": require("../assets/fonts/static/NotoSerif_Condensed-Regular.ttf"),
    "NotoSerifCondensed-Bold": require("../assets/fonts/static/NotoSerif_Condensed-Bold.ttf"),
  });

  const [translations, setTranslations] = useState({
    title: "Please enter your email address.",
    labelText: "Label",
    placeholderText: "Email",
    termsText: "By logging in, you agree to our",
    termsOfUseText: "Terms of Use",
    privacyPolicyText: "Privacy Policy",
    nextButtonText: "Next",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTranslations() {
      try {
        const keys = Object.keys(translations);
        const newTranslations = {};

        for (const key of keys) {
          newTranslations[key] = await translateText(translations[key]); // Translate each text
        }

        setTranslations(newTranslations); // Set translated texts
        setLoading(false);
      } catch (error) {
        console.error("Error fetching translations:", error);
        setLoading(false);
      }
    }

    fetchTranslations();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1F6CAE" />
        <Text style={styles.translatingText}>Translating...</Text>
      </SafeAreaView>
    ); // Show loader and translating text while fonts are loading or translations are being fetched
  }

  const handleSubmit = () => {
    // Perform email validation here
    navigation.navigate("Login", { email: email });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
      

        <View style={styles.content}>
          <Text
            style={[styles.title, { fontFamily: "NotoSerifCondensed-Bold" }]}
          >
            {translations.title}
          </Text>

          <View
            style={[
              styles.inputContainer,
              email !== "" && styles.inputContainerActive,
            ]}
          >
            {email === "" && (
              <Text style={styles.labelText}>{translations.labelText}</Text>
            )}
            <View style={styles.inputContainerSub}>
              <Ionicons
                name="mail-outline"
                size={24}
                color="gray"
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input]}
                placeholder={translations.placeholderText}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {email !== "" && (
                <TouchableOpacity onPress={() => setEmail("")}>
                  <Ionicons name="close-circle" size={24} color="gray" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <Text style={[styles.termsText]}>
            {translations.termsText}
            <Text style={styles.linkText}> {translations.termsOfUseText} </Text> and
            <Text style={styles.linkText}> {translations.privacyPolicyText} </Text>.
          </Text>

          <TouchableOpacity
            style={[styles.nextButton, email !== "" && styles.nextButtonActive]}
            disabled={email === ""}
            onPress={handleSubmit}
          >
            <Text
              style={[
                styles.nextButtonText,
                email !== "" && styles.nextButtonTextActive,
              ]}
            >
              {translations.nextButtonText}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    width: "100%",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  translatingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#1F6CAE",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    marginTop: 30,
  },
  closeButton: {
    fontSize: 18,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 20,
    justifyContent: "center",
    paddingVertical: 24,
    marginTop: -30,
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    marginBottom: 54,
  },
  inputContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 65,
    backgroundColor: "#F5F5F5",
  },
  inputContainerActive: {
    borderWidth: 0,
    backgroundColor: "#E0E0E0",
    borderBottomWidth: 2,
    borderBottomColor: "#1F6CAE",
  },
  inputContainerSub: {
    flexDirection: "row",
    justifyContent: "center",
  },
  labelText: {
    color: "#1F6CAE",
    fontSize: 12,
    marginLeft: 30,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    width: "100%",
  },
  termsText: {
    fontSize: 16,
    color: "gray",
  },
  linkText: {
    color: "#1F6CAE",
  },
  nextButton: {
    backgroundColor: "lightgray",
    borderRadius: 24,
    paddingVertical: 18,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  nextButtonActive: {
    backgroundColor: "#1F6CAE",
  },
  nextButtonText: {
    color: "gray",
    fontSize: 16,
    fontWeight: "bold",
  },
  nextButtonTextActive: {
    color: "white",
  },
});
