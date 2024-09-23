import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const languages = [
  {
    code: "pt",
    name: "Portuguese",
    flag: require("../assets/PT-Portugal.png"),
  },
  {
    code: "pt-BR",
    name: "Portuguese (Brazil)",
    flag: require("../assets/BR-Brazil.png"),
  },
  {
    code: "en",
    name: "English",
    flag: require("../assets/GB-UnitedKingdom.png"),
  },
];

export default function WelcomeScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState("pt");
  const navigation = useNavigation();

  // Load the custom font
  let [fontsLoaded] = useFonts({
    "NotoSerifCondensed-Regular": require("../assets/fonts/static/NotoSerif_Condensed-Regular.ttf"),
    "NotoSerifCondensed-Bold": require("../assets/fonts/static/NotoSerif_Condensed-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const handleLanguageSelect = async (langCode) => {
    const selectedLang = languages.find((lang) => lang.code === langCode);

    Alert.alert(
      "Confirme a seleção",
      `Por favor, confirme que o português é sua língua preferida. Você gostaria de continuar usando o português?`,
      [
        {
          text: "Confirme",
          onPress: async () => {
          setSelectedLanguage(langCode);
            try {
              await AsyncStorage.setItem("selectedLanguage", selectedLang.name);
            } catch (error) {
              console.error("Error saving language", error);
            }
            navigation.navigate("Login");
          },
        },
        {
          text: "Cancelar",
          onPress: () =>{},
        },
      ]
    );
  };

  if (!fontsLoaded) {
    return null; // Render nothing until the font is loaded
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={[styles.title, { fontFamily: "NotoSerifCondensed-Bold" }]}>
          Welcome
        </Text>
        <Text style={[styles.subtitle]}>
          Please set your preferences to get the app up and running.
        </Text>

        <View style={styles.card}>
          <Text
            style={[
              styles.cardTitle,
              { fontFamily: "NotoSerifCondensed-Bold" },
            ]}
          >
            1 OF 2
          </Text>
          <Text
            style={[
              styles.cardSubtitle,
              { fontFamily: "NotoSerifCondensed-Bold" },
            ]}
          >
            escolha a sua linguagem preferida
          </Text>

          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageOption,
                selectedLanguage === lang.code && styles.selectedLanguage,
              ]}
              onPress={() => handleLanguageSelect(lang.code)}
            >
              <Image source={lang.flag} style={styles.flag} />
              <Text
                style={[
                  styles.languageName,
                  { fontFamily: "NotoSerifCondensed-Regular" },
                ]}
              >
                {lang.name}
              </Text>

              <View
                style={[
                  styles.radioButton,
                  selectedLanguage === lang.code && styles.radioButtonSelected,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333333",
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
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 13,
    width: "60%",
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    marginVertical: 5,
    width: "100%",
  },
  selectedLanguage: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ccc",
    padding: 10,
  },
  flag: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  languageName: {
    fontSize: 16,
    flex: 1,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ccc",
    backgroundColor: "#ccc",
  },
  radioButtonSelected: {
    borderColor: "#1CAC62",
    backgroundColor: "#1CAC62",
  },
});
