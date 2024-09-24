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
  Keyboard,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import translateText from "./../ult/TranslationService";
import * as Notifications from "expo-notifications";
import CustomLoader from "../components/CustomLoader";
import Constants from "expo-constants";
import * as Device from "expo-device";
const DEFAULT_LANGUAGE = "pt-BR"; // Portuguese (Brazil)

export default function SignUpScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [statusMessage, setStatusMessage] = useState("Initializing...");
  const [notificationType, setNotificationType] = useState("");
  const [tokenError, setTokenError] = useState(null);
  const [translations, setTranslations] = useState({
    usernameLabel: "Username",
    emailLabel: "Email",
    passwordLabel: "palavra-passe",
    emailError: "Please enter a valid email address.",
    passwordError: "Password must be at least 6 characters long.",
    termsText: "Ao fazer login, concorda com os nossos Termos de Utilização e",
    termsOfUseText: "Política",
    privacyPolicyText: "Privacidade",
    signUpButtonText: "Criar conta",
    signingUpButtonText: "Signing Up...",
    continueWithGoogleText: "Continue with Google",
  });

  const navigation = useNavigation();

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

  useEffect(() => {
    async function fetchTranslations() {
      try {
        const translatedTexts = {};
        for (const key in translations) {
          translatedTexts[key] = await translateText(translations[key]);
        }
        setTranslations(translatedTexts);
      } catch (error) {
        console.error("Error fetching translations:", error);
      }
    }

    fetchTranslations();
    registerForPushNotificationsAsync();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    const projectId = Constants?.expoConfig?.extra?.eas?.projectId;

    if (!Device.isDevice) {
      setStatusMessage("Must use a physical device.");
      Alert.alert(
        "Physical device required",
        "Push notifications only work on physical devices."
      );
      return;
    }

    try {
      setStatusMessage("Requesting notification permissions...");
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        setStatusMessage("Push notification permission was not granted.");
        Alert.alert(
          "Permission required",
          "Push notification permission was not granted."
        );
        return;
      }

      setStatusMessage("Fetching Expo push token...");
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      setExpoPushToken(tokenData.data);
      setNotificationType(tokenData.type);
      setStatusMessage(
        `Push token fetched. Type: ${tokenData.type}, Token: ${tokenData.data}`
      );

      if (Platform.OS === "android") {
        setStatusMessage("Setting up notification channel...");
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
        setStatusMessage("Notification channel set.");
      }
    } catch (error) {
      setStatusMessage("Error fetching push token.");
      setTokenError("Failed to get push token");
    }
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSignUp = async () => {
    let valid = true;

    if (!validateEmail(email)) {
      setEmailError(translations.emailError);
      valid = false;
    } else {
      setEmailError("");
    }

    if (password.length < 6) {
      setPasswordError(translations.passwordError);
      valid = false;
    } else {
      setPasswordError("");
    }

    if (!valid) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://tejomag.com/wp-json/tejo-mag/v1/register",
        {
          username,
          email,
          password,
          expo_token: expoPushToken,
        }
      );

      if (
        response.data &&
        response.data.user_id &&
        response.data.username &&
        response.data.email
      ) {
        await AsyncStorage.setItem("userExpoToken", response.data.expo_token);

        Alert.alert(
          "Sign Up Successful",
          `Your account has been created successfully, ${username}!`
        );
        navigation.navigate("Login");
      } else {
        Alert.alert(
          "Sign Up Failed",
          "Unable to create an account. The server response was unexpected. Please try again or contact support."
        );
      }
    } catch (error) {
      console.error("Error in signUp:", error);

      if (error.response) {
        let errorMessage = "Sign Up Failed";
        let detailsMessage = "";

        if (error.response.data && error.response.data.errors) {
          errorMessage += ": ";
          if (typeof error.response.data.errors === "object") {
            Object.keys(error.response.data.errors).forEach((key) => {
              detailsMessage += `${key}: ${error.response.data.errors[key]}\n`;
            });
          } else if (Array.isArray(error.response.data.errors)) {
            detailsMessage = error.response.data.errors.join("\n");
          } else {
            detailsMessage = error.response.data.errors.toString();
          }
        } else if (error.response.data && error.response.data.message) {
          detailsMessage = error.response.data.message;
        } else {
          errorMessage += `: HTTP Error ${error.response.status}`;
          detailsMessage = `Status: ${error.response.statusText}\nPlease try again later or contact support if the problem persists.`;
        }

        Alert.alert(errorMessage, detailsMessage);
      } else if (error.request) {
        console.error("No response received:", error.request);
        Alert.alert(
          "Network Error",
          "No response received from the server. Please check your internet connection and try again."
        );
      } else {
        console.error("Error occurred in request setup:", error.message);
        Alert.alert(
          "Unexpected Error",
          `An unexpected error occurred while signing up: ${error.message}\nPlease try again or contact support if the problem persists.`
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!fontsLoaded || isLoading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <CustomLoader text="Please wait..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* {!isKeyboardVisible && (
            <TouchableOpacity style={styles.googleButton}>
              <Image
                source={require("../assets/google.png")}
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>
                {translations.continueWithGoogleText}
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View> */}

          {/* Username Input */}
          <View
            style={[
              styles.inputContainer,
              username !== "" && styles.inputContainerActive,
            ]}
          >
            {username === "" && (
              <Text style={styles.labelText}>{translations.usernameLabel}</Text>
            )}
            <View style={styles.inputContainerSub}>
              <Ionicons
                name="person-outline"
                size={24}
                color="gray"
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input]}
                placeholder={translations.usernameLabel}
                value={username}
                onChangeText={setUsername}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                autoCapitalize="none"
              />
              {username !== "" && (
                <TouchableOpacity onPress={() => setUsername("")}>
                  <Ionicons name="close-circle" size={24} color="gray" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Email Input */}
          <View
            style={[
              styles.inputContainer,
              email !== "" && styles.inputContainerActive,
            ]}
          >
            {email === "" && (
              <Text style={styles.labelText}>{translations.emailLabel}</Text>
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
                placeholder={translations.emailLabel}
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
            {emailError !== "" && (
              <Text style={styles.errorText}>{emailError}</Text>
            )}
          </View>

          {/* Password Input */}
          <View
            style={[
              styles.inputContainer,
              password !== "" && styles.inputContainerActive,
            ]}
          >
            {password === "" && (
              <Text style={styles.labelText}>{translations.passwordLabel}</Text>
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
                placeholder={translations.passwordLabel}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
            {passwordError !== "" && (
              <Text style={styles.errorText}>{passwordError}</Text>
            )}
          </View>

          <Text style={styles.termsText}>
            {translations.termsText}
            <Text style={styles.linkText}>
              {translations.termsOfUseText}{" "}
            </Text>{" "}
            and
            <Text style={styles.linkText}>
              {translations.privacyPolicyText}
            </Text>
            .
          </Text>

          <TouchableOpacity
            style={[
              styles.nextButton,
              username !== "" &&
                email !== "" &&
                password !== "" &&
                styles.nextButtonActive,
            ]}
            disabled={
              username === "" || email === "" || password === "" || isLoading
            }
            onPress={handleSignUp}
          >
            <Text
              style={[
                styles.nextButtonText,
                username !== "" &&
                  email !== "" &&
                  password !== "" &&
                  styles.nextButtonTextActive,
              ]}
            >
              {isLoading
                ? translations.signingUpButtonText
                : translations.signUpButtonText}
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
  nextButton: {
    backgroundColor: "lightgray",
    borderRadius: 24,
    paddingVertical: 18,
    alignItems: "center",
    width: "100%",
    marginTop: 50,
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
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
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
  tokenContainer: {
    padding: 20,
    alignItems: "center",
  },
  tokenText: {
    color: "#1F6CAE",
    fontSize: 16,
  },
  tokenTextError: {
    color: "red",
    fontSize: 16,
  },
});
