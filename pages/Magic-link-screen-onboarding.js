import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useNavigation, useRoute } from "@react-navigation/native";
import translateText from "../ult/TranslationService";

export default function CheckEmailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const email = route.params?.email || "";
  const [translatedText, setTranslatedText] = useState({
    checkEmail: "Verifique o seu e-mail!",
    emailInstructions: "Enviámos um e-mail para",
    linkInstructions: "Contém um link especial. Clique nele para redefinir a sua palavra-passe.",
    openMailApp: "Open Mail App",
  });

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

  if (!fontsLoaded) {
    return null; // Render nothing until fonts are loaded
  }

  const openEmailApp = async () => {
    let url;
    if (Platform.OS === 'ios') {
      url = 'message://';
    } else if (Platform.OS === 'android') {
      url = 'mailto:';
    }

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
        // Navigate to NewPassword screen after opening the email app
        navigation.navigate("NewPassword", { email: email });
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    } catch (error) {
      console.error("An error occurred", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={[styles.title, { fontFamily: "NotoSerifCondensed-Bold" }]}>
          {translatedText.checkEmail}
        </Text>

        <View style={styles.imageContainer}>
          <Image
            source={require("../assets/Email-image.png")}
            style={styles.envelopeImage}
            resizeMode="contain"
          />
        </View>

        <Text style={[styles.instructions]}>
          {translatedText.emailInstructions}{"\n"}
          <Text style={[styles.email]}>{email}</Text>.
        </Text>

        <Text style={[styles.subInstructions]}>
          {translatedText.linkInstructions}
        </Text>

        <TouchableOpacity style={styles.button} onPress={openEmailApp}>
          <Text style={[styles.buttonText]}>{translatedText.openMailApp}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    width: "100%",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 35,
    lineHeight: 40,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  imageContainer: {
    marginBottom: 40,
  },
  envelopeImage: {
    width: 156,
    height: 156,
    marginVertical: 30,
  },
  instructions: {
    fontSize: 16,
    textAlign: "center",
  },
  email: {
    color: "#1F6CAE",
    fontWeight: "bold",
  },
  subInstructions: {
    fontSize: 16,
    textAlign: "center",
    color: "gray",
    marginBottom: 30,
    marginTop: 20,
  },
  button: {
    backgroundColor: "#1F6CAE",
    paddingVertical: 18,
    borderRadius: 24,
    width: "100%",
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});