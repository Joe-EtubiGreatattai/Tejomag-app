import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import translateText from "./../ult/TranslationService"; // Import your translation function

const DEFAULT_LANGUAGE = "pt-BR"; // Portuguese (Brazil)

export default function WelcomeScreen() {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    "NotoSerifCondensed-Regular": require("../assets/fonts/static/NotoSerif_Condensed-Regular.ttf"),
    "NotoSerifCondensed-Bold": require("../assets/fonts/static/NotoSerif_Condensed-Bold.ttf"),
  });

  const [translations, setTranslations] = useState({
    title: ["Welcome", "Translating..."],
    subtitle: [
      "Please set your preferences to get the app up and running.",
      "Translating...",
    ],
    cardSubtitle: ["Don't miss our top stories!", "Translating..."],
    subscribeText: [
      "Subscribe to our notifications to stay up to date on the latest breaking news.",
      "Translating...",
    ],
    subscribeButtonText: ["Subscribe to Notifications Now", "Translating..."],
    noThanksText: ["No Thanks", "Translating..."],
  });

  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(true); // New state for translation status
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const isMounted = useRef(true); // Track if component is mounted

  useEffect(() => {
    async function fetchTranslations() {
      try {
        const storedLanguage =
          (await AsyncStorage.getItem("selectedLanguage")) || DEFAULT_LANGUAGE;

        for (const key in translations) {
          const defaultText = translations[key][0];

          const translated = await translateText(defaultText); // Use the imported translation function

          setTranslations((prevTranslations) => {
            if (!isMounted.current) return prevTranslations;
            const updatedTranslations = { ...prevTranslations };
            updatedTranslations[key][1] = translated;
            return updatedTranslations;
          });
        }

        if (isMounted.current) {
          setTranslating(false); // Set translating to false once all translations are done
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching translations:", error);
        if (isMounted.current) {
          setTranslating(false); // Set translating to false in case of an error
          setLoading(false);
        }
      }
    }

    fetchTranslations();

    return () => {
      isMounted.current = false; // Mark component as unmounted
    };
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleSubscribe = () => {
    Alert.alert(
      "Allow /Tejomag to send notifications?",
      "Notifications may include alerts, sounds, and icon badges. These can be configured in Settings.",
      [
        {
          text: "Allow Notifications",
          onPress: () => {
             navigation.navigate("EmailEntry");
          },
        },
        {
          text: "Deny",
          onPress: () => {
            },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {translating ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.translatingText}>Translating...</Text>
        </View>
      ) : (
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <Text style={[styles.title, { fontFamily: "NotoSerifCondensed-Bold" }]}>
            {translations.title[1]}
          </Text>
          <Text style={styles.subtitle}>{translations.subtitle[1]}</Text>
          <View style={styles.card}>
            <Text
              style={[
                styles.cardTitle,
                { fontFamily: "NotoSerifCondensed-Bold" },
              ]}
            >
              2 OF 2
            </Text>
            <Text
              style={[
                styles.cardSubtitle,
                { fontFamily: "NotoSerifCondensed-Bold" },
              ]}
            >
              {translations.cardSubtitle[1]}
            </Text>
            <Text style={styles.subtitleText}>
              {translations.subscribeText[1]}
            </Text>
            <TouchableOpacity
              style={styles.subscribeButton}
              onPress={handleSubscribe}
            >
              <Text style={styles.buttonText}>
                {translations.subscribeButtonText[1]}
              </Text>
            </TouchableOpacity>
            <Text style={styles.noThanksText} onPress={handleSubscribe}>
              {translations.noThanksText[1]}
            </Text>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F6CAE",
    width: "100%",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitleText: {
    textAlign: "center",
    marginVertical: 30,
    fontSize: 16,
    color: "#404040",
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginVertical: 63,
    width: "60%",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    height: 432,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 12,
    color: "#963F6E",
    textAlign: "center",
    marginVertical: 33,
  },
  cardSubtitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 13,
    width: "80%",
  },
  subscribeButton: {
    backgroundColor: "#1F6CAE",
    borderRadius: 100,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
  noThanksText: {
    fontSize: 16,
    color: "#1F6CAE",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  translatingText: {
    marginTop: 10,
    fontSize: 18,
    color: "#fff",
  },
});
