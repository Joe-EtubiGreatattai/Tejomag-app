import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as Google from "expo-auth-session/providers/google";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import translateText from "../ult/TranslationService"; // Import the translateText function
import { useAuth } from "./../navigation/OnboardingNavigator"; // Update this path
import CustomLoader from "../components/CustomLoader";

const DEFAULT_LANGUAGE = "pt-BR"; // Portuguese (Brazil)

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // New state for showing/hiding password
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New state for loading
  const { login } = useAuth();

  const [translations, setTranslations] = useState({
    title: ["Iniciar sessão", "Translating..."],
    googleButtonText: ["Continue with Google", "Translating..."],
    dividerText: ["OR", "Translating..."],
    emailLabel: ["Email", "Translating..."],
    passwordLabel: ["palavra-passe", "Translating..."],
    termsText: [
      "Ao fazer login, concorda com os nossos Termos de Utilização e Política de Privacidade.",
      "Translating...",
    ],
    termsOfUseText: ["Terms of Use", "Translating..."],
    privacyPolicyText: ["Privacy Policy", "Translating..."],
    nextButtonText: ["Iniciar sessão", "Translating..."],
    signupPromptText: ["", "Translating..."],
    signupLinkText: ["esqueci a sua palavra-passe ?", "Translating..."],
  });
  const navigation = useNavigation();

  // Load custom fonts
  const [fontsLoaded] = useFonts({
    "NotoSerifCondensed-Regular": require("../assets/fonts/static/NotoSerif_Condensed-Regular.ttf"),
    "NotoSerifCondensed-Bold": require("../assets/fonts/static/NotoSerif_Condensed-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsKeyboardVisible(false)
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "YOUR_EXPO_CLIENT_ID",
    iosClientId: "YOUR_IOS_CLIENT_ID",
    androidClientId: "YOUR_ANDROID_CLIENT_ID",
    webClientId: "YOUR_WEB_CLIENT_ID",
    redirectUri: "tejomag://",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      navigation.navigate("Home");
    }
  }, [response]);

  useEffect(() => {
    async function fetchTranslations() {
      try {
        const storedLanguage =
          (await AsyncStorage.getItem("selectedLanguage")) || DEFAULT_LANGUAGE;

        const translateAllTexts = async () => {
          const translatedTexts = {};

          for (const key in translations) {
            translatedTexts[key] = await translateText(translations[key][0]);
          }

          setTranslations((prevTranslations) => {
            const updatedTranslations = { ...prevTranslations };

            for (const key in translatedTexts) {
              updatedTranslations[key][1] = translatedTexts[key];
            }

            return updatedTranslations;
          });
        };

        await translateAllTexts();
      } catch (error) {
        console.error("Error fetching translations:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching translations
      }
    }

    fetchTranslations();
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        navigation.navigate("Home", { userName: result.userName });
      }
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!fontsLoaded || loading || isLoading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <CustomLoader text="Please wait..." />
      </SafeAreaView>
    ); // Show loader and translating text while fonts are loading or translations are being fetched
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.content}>
          {!isInputFocused && (
            <Text
              style={[styles.title, { fontFamily: "NotoSerifCondensed-Bold" }]}
            >
              {translations.title[1]}
            </Text>
          )}

          <TouchableOpacity
            style={styles.googleButton}
            disabled={!request}
            onPress={() => {
              promptAsync();
            }}
          >
            <Image
              source={require("../assets/google.png")}
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>
              {translations.googleButtonText[1]}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>
              {translations.dividerText[1]}
            </Text>
            <View style={styles.dividerLine} />
          </View>

          <View
            style={[
              styles.inputContainer,
              email !== "" && styles.inputContainerActive,
            ]}
          >
            {email === "" && (
              <Text style={styles.labelText}>{translations.emailLabel[1]}</Text>
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
                placeholder={translations.emailLabel[1]}
                value={email}
                onChangeText={setEmail}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
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

          <View
            style={[
              styles.inputContainer,
              password !== "" && styles.inputContainerActive,
            ]}
          >
            {password === "" && (
              <Text style={styles.labelText}>
                {translations.passwordLabel[1]}
              </Text>
            )}
            <View style={styles.inputContainerSub}>
              <Ionicons
                name="lock-closed-outline"
                size={24}
                color="gray"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder={translations.passwordLabel[1]}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                secureTextEntry={!showPassword} // Toggle secureTextEntry based on showPassword state
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)} // Toggle password visibility
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"} // Change icon based on password visibility
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.forgotPasswordText}>
              {translations.signupLinkText[1]}{" "}
              {/* This will show "esqueci a sua palavra-passe ?" */}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.termsButton}
            onPress={() => {
              Alert.alert(
                translations.termsText[1] +
                  " " +
                  translations.termsOfUseText[1] +
                  " " +
                  translations.privacyPolicyText[1]
              );
            }}
          >
            <Text style={styles.termsText}>
              {translations.termsText[1]} {translations.termsOfUseText[1]}{" "}
              {translations.privacyPolicyText[1]}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.loginButton,
              email && password && styles.loginButtonActive,
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>
                {translations.nextButtonText[1]}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>
              {translations.signupPromptText[1]}{" "}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={styles.signUpLink}>
                {translations.signupLinkText[1]}
              </Text>
            </TouchableOpacity>
          </View>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    marginTop: 30,
    backgroundColor: "#fff",
    zIndex: 999,
  },
  closeButton: {
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 20,
    justifyContent: "center",
    paddingVertical: 24,
    marginTop: 70,
  },
  title: {
    fontSize: 38,
    lineHeight: 46,
    marginBottom: 24,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 44,
    padding: 15,
  },
  buttonIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  buttonText: {
    fontSize: 16,
    color: "#777",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "lightgray",
  },
  dividerText: {
    paddingHorizontal: 10,
    color: "gray",
  },
  inputContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 6,
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
  loginButton: {
    borderRadius: 24,
    paddingVertical: 18,
    alignItems: "center",
    width: "100%",
    marginTop: 50,
    backgroundColor: "#888",
  },
  loginButtonActive: {
    backgroundColor: "#1F6CAE",
  },
  nextButtonDisabled: {
    backgroundColor: "#B0BEC5", // Disabled color
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  nextButtonTextActive: {
    color: "white",
  },
  nextButtonTextDisabled: {
    color: "#FFFFFF", // Disabled text color
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signUpText: {
    fontSize: 16,
    color: "gray",
  },
  signUpLink: {
    fontSize: 16,
    color: "#1F6CAE",
    fontWeight: "bold",
    marginLeft: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  translatingText: {
    marginTop: 16,
    fontSize: 16,
    color: "black",
  },
  forgotPasswordText: {
    color: "#1F6CAE", // Blue color
    textAlign: "left",
    marginTop: 0,
    fontSize: 14,
    fontWeight: "500",
  },
});
