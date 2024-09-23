import React, { memo } from "react";
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font"; // Import useFonts hook
import Markdown from "react-native-markdown-display";
import { cleanText } from '../ult/textCleaner'; 

const NewsHeader = ({ logoSource, title, date, onPress }) => {
  // Load custom fonts
  const [fontsLoaded] = useFonts({
    "NotoSerifCondensed-Bold": require("../assets/fonts/static/NotoSerif_Condensed-Black.ttf"),
  });

  if (!fontsLoaded) {
    return null; // Return null or a loading component while fonts are loading
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.logoContainer}>
        <Image
          source={logoSource}
          style={styles.logo}
        />
      </View>
      <View style={styles.textContainer}>
        <Markdown style={styles.title}>
        {cleanText(title)}
          </Markdown>
        <Text style={styles.date}>{date}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: Dimensions.get("window").width - 20,
    marginVertical: 5,
    margin: 'auto'
  },
  logoContainer: {
    marginRight: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 25,
    fontFamily: "NotoSerifCondensed-Bold",
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
});

export default memo(NewsHeader);
