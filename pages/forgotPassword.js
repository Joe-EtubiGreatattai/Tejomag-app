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
  Dimensions,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import translateText from "./../ult/TranslationService";

const DEFAULT_LANGUAGE = "pt-BR";

export default function EmailEntryScreen() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    "NotoSerifCondensed-Regular": require("../assets/fonts/static/NotoSerif_Condensed-Regular.ttf"),
    "NotoSerifCondensed-Bold": require("../assets/fonts/static/NotoSerif_Condensed-Bold.ttf"),
  });

  const [translations, setTranslations] = useState({
    title: "esqueci a sua palavra-passe ?",
    labelText: "Label",
    placeholderText: "Email",
    termsText: "By logging in, you agree to our",
    termsOfUseText: "Terms of Use",
    privacyPolicyText: "Privacy Policy",
    nextButtonText: "Reiniciar a palavra-passe",
    emailSentText: "Email enviado com sucesso",
    errorText: "Ocorreu um erro. Por favor, tente novamente.",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTranslations() {
      try {
        const keys = Object.keys(translations);
        const newTranslations = {};

        for (const key of keys) {
          newTranslations[key] = await translateText(translations[key]);
        }

        setTranslations(newTranslations);
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
    );
  }

  const handleSubmit = async () => {
    if (email) {
      setIsLoading(true);
      try {
        const response = await fetch('https://tejomag.com/wp-json/tejo-mag/v1/password-reset-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
          Alert.alert(translations.emailSentText, data.message);
          navigation.navigate("magicEmail", { email: email });
        } else {
          throw new Error(data.message || 'An error occurred');
        }
      } catch (error) {
        console.error('Error:', error);
        Alert.alert(translations.errorText, error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
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
        </View>

        <TouchableOpacity
          style={[styles.nextButton, email !== "" && styles.nextButtonActive]}
          disabled={email === "" || isLoading}
          onPress={handleSubmit}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text
              style={[
                styles.nextButtonText,
                email !== "" && styles.nextButtonTextActive,
              ]}
            >
              {translations.nextButtonText}
            </Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    width: Dimensions.get("window").width,
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: "space-around",
    paddingVertical: 24,
    alignItems:'center',
    width:'100%'
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
  content: {
    paddingTop: 50, // Move the content closer to the top
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    marginBottom: 44, // Adjust spacing between title and input
  },
  inputContainer: {
    flexDirection: "column",
    justifyContent: "center",
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
  nextButton: {
    backgroundColor: "lightgray",
    borderRadius: 24,
    paddingVertical: 18,
    alignItems: "center",
    width: "90%",
    marginTop:20
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
