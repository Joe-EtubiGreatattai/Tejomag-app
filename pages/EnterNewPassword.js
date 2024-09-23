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
  Alert,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function ResetPasswordScreen() {
  const [resetCode, setResetCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const email = route.params?.email || "";

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async () => {
    if (!resetCode || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('https://tejomag.com/wp-json/tejo-mag/v1/change-email-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          reset_code: resetCode,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", data.message);
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", data.message || "Failed to reset password");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while resetting password");
    } finally {
      setSubmitting(false);
    }
  };

  // Load custom fonts
  const [fontsLoaded] = useFonts({
    "NotoSerifCondensed-Regular": require("../assets/fonts/static/NotoSerif_Condensed-Regular.ttf"),
    "NotoSerifCondensed-Bold": require("../assets/fonts/static/NotoSerif_Condensed-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      setLoading(false);
    }
  }, [fontsLoaded]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1F6CAE" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Text style={styles.title}>Reset your Password</Text>

        {/* Reset Code Field */}
        <View style={styles.inputContainer}>
          <Ionicons name="key-outline" size={24} color="gray" />
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Reset Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter reset code"
              value={resetCode}
              onChangeText={setResetCode}
              keyboardType="number-pad"
            />
          </View>
        </View>

        {/* Password Field */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={24} color="gray" />
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your new password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        {/* Password Requirements Text */}
        <Text style={styles.passwordInfo}>
          A palavra-passe deve estar acima de 6 caracteres. {"\n"}Considere a
          utilização de uma combinação de letras, números e símbolos.
        </Text>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={submitting || !resetCode || !password}
        >
          {submitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Reset Password</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "white",
    justifyContent: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontFamily: "NotoSerifCondensed-Bold",
    marginBottom: 44,
    textAlign: "left",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 60,
    backgroundColor: "#F5F5F5",
  },
  inputWrapper: {
    flex: 1,
    marginLeft: 8,
  },
  label: {
    fontSize: 14,
    color: "#1F6CAE",
    marginTop: 8
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  passwordInfo: {
    fontSize: 12,
    color: "gray",
    marginBottom: 24,
    textAlign: "left",
  },
  submitButton: {
    backgroundColor: "#1F6CAE",
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});