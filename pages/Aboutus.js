import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomLoader from '../components/CustomLoader';
const Aboutus = () => {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    "NotoSerifCondensed-Regular": require("../assets/fonts/static/NotoSerif_Condensed-Regular.ttf"),
    "NotoSerifCondensed-Bold": require("../assets/fonts/static/NotoSerif_Condensed-Bold.ttf"),
  });

  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      setLoading(false);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Return null or a loading component while fonts are loading
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
        <CustomLoader text="Please wait..." />
        </View>
      ) : (
        <>
          <Text
            style={[styles.title, { fontFamily: "NotoSerifCondensed-Bold" }]}
          >
            Quem somos
          </Text>

          <ScrollView>
            <Text style={styles.bodyText}>
              Somos uma publicação periódica eletrónica. Pretendemos focar-nos na
              análise das transformações emergentes. Trabalhamos com uma equipa
              de jornalistas, no sentido de garantir uma abordagem plural,
              isenta e rigorosa. Ao sair da espuma dos acontecimentos, trazemos
              para o domínio público a análise da atualidade através de
              reportagens de fundo. Informamos para além das margens do rio e do
              pensamento.
            </Text>

            {/* Additional Title and Text */}
            <Text
              style={[styles.subTitle, { fontFamily: "NotoSerifCondensed-Bold" }]}
            >
              Entre em contato.
            </Text>
            <Text style={styles.bodyText}>
            POETIC CLOUDS (NIF: 517988615)
            </Text>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 10,
    marginHorizontal: "auto",
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
  subTitle: {
    fontSize: 24,
    lineHeight: 38,
    fontWeight: "bold",
    marginTop: 25,
  },
  bodyText: {
    fontSize: 16,
    color: "#404040",
    marginTop: 10, 
    lineHeight: 28,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: "#1F6CAE",
  },
});

export default Aboutus;
