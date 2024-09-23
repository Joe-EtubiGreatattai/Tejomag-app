import React, { memo } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Share,
  Dimensions,
  StyleSheet,
  Text,
  LogBox,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import Markdown from "react-native-markdown-display";
import { cleanText } from "../ult/textCleaner";
const NewsArticleCard = ({
  id,
  title = "Default Title",
  subtitle = "Default Subtitle",
  author = "Unknown Author",
  date = "Unknown Date",
  image,
  permalink,
  onPress,
}) => {
  // Load the custom font
  const [fontsLoaded] = useFonts({
    "NotoSerifCondensed-Bold": require("../assets/fonts/static/NotoSerif_Condensed-ExtraBold.ttf"),
  });

  if (!fontsLoaded) {
    return null; // Render nothing until the font is loaded
  }

  const onShare = async () => {
    try {
      const shareMessage = `
Title: ${cleanText(title)}
Author: ${author}
Date: ${date}
Link: ${permalink}

Check out this article!`;

      const result = await Share.share({
        message: shareMessage,
        title: cleanText(title),
        url: permalink,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.topSection}>
        <View style={styles.textSection}>
          <Text style={styles.title}>{cleanText(title)}</Text>
        </View>
        <Image source={image} style={styles.image} />
      </View>
      <Markdown style={markdownStyles}>{cleanText(subtitle)}</Markdown>
      <View style={styles.bottomSection}>
        <View style={styles.authorContainer}>
          <Text style={styles.author}>{author}</Text>
          <Text style={styles.date}>• {date}</Text>
        </View>
        <TouchableOpacity style={styles.shareButton} onPress={onShare}>
          <Ionicons name="share-social" size={20} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginVertical: 0,
    height: "auto",
    width: Dimensions.get("window").width - 20,
    borderTopWidth: 1,
    borderTopColor: "#999",
    margin: "auto",
  },
  topSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  textSection: {
    flex: 1,
    marginRight: 16,
  },
  image: {
    width: 156,
    height: 104,
    borderRadius: 8,
    resizeMode: "cover",
  },
  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  author: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  shareButton: {
    padding: 4,
  },
  title: {
    fontSize: 24,
    fontFamily: "NotoSerifCondensed-Bold",
    color: "#000",
    marginBottom: 8,
  },
});

const markdownStyles = {
  body: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 8,
  },
};

export default memo(NewsArticleCard);
