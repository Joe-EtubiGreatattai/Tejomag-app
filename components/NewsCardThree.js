import React, { memo } from "react";
import { View, StyleSheet, Share, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Markdown from "react-native-markdown-display";
import { useFonts } from "expo-font";
import { useNavigation } from '@react-navigation/native';
import { cleanText } from '../ult/textCleaner'; 

const NewsCard = ({
  category,
  premium,
  live,
  title,
  subtitle,
  author,
  date,
  onPress,
  permalink
}) => {
  // Load the custom font
  const [fontsLoaded] = useFonts({
    "NotoSerifCondensed-Bold": require("../assets/fonts/static/NotoSerif_Condensed-ExtraBold.ttf"),
  });

  if (!fontsLoaded) {
    return null; // Render nothing until the font is loaded
  }

  const navigation = useNavigation();

  const handleNewsCardPress = (newsId) => {
    navigation.navigate("Article", { id: newsId });
  };

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
      <Text style={[styles.titleHeader, { fontFamily: "NotoSerifCondensed-Bold" }]}>
        Popular in {category}
      </Text>
      
      <View style={styles.categoryContainer}>
        <Text style={styles.category}>{category}</Text>
        {premium && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>PREMIUM</Text>
          </View>
        )}
        {live && (
          <View style={styles.liveBadge}>
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}
      </View>

      <Text style={[styles.title, { fontFamily: "NotoSerifCondensed-Bold" }]}>
      {cleanText(title)}
      </Text>

      {/* Clean subtitle before displaying */}
      <Markdown style={styles.subtitle}>
        {cleanText(subtitle)}
      </Markdown>

      <View style={styles.footer}>
        <Text style={styles.author}>{author}</Text>
        <Text style={styles.dot}>•</Text>
        <Text style={styles.date}>{date}</Text>
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
    width: "100%",
    margin: 'auto'
  },
  titleHeader: {
    fontSize: 24,
    fontFamily: "NotoSerifCondensed-Bold",
    textAlign: "left",
    marginBottom: 20,
    lineHeight: 32,
    color: "#333333",
    width: "100%",
  },
  categoryContainer: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  category: {
    color: "#963F6E",
    fontSize: 12,
    marginRight: 8,
  },
  premiumBadge: {
    backgroundColor: "#8B0000",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
  },
  premiumText: {
    color: "white",
    fontSize: 10,
  },
  liveBadge: {
    backgroundColor: "#FF4500",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  liveText: {
    color: "white",
    fontSize: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
    color: "#333333",
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 14,
    color: "#333333",
    marginBottom: 8,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
  },
  author: {
    fontSize: 12,
    color: "#666",
  },
  dot: {
    fontSize: 12,
    color: "#666",
    marginHorizontal: 4,
  },
  date: {
    fontSize: 12,
    color: "#666",
  },
  shareButton: {
    marginLeft: "auto",
  },
});

export default memo(NewsCard);
