import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Share,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cleanText } from "../ult/textCleaner";
import AppLoading from 'expo-app-loading';
import { useFonts, Manrope_400Regular, Manrope_700Bold } from '@expo-google-fonts/manrope';

const placeholderImage = "https://placehold.co/600x400";
const contentWidth = Dimensions.get("window").width;

// New function to format the date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

const ArticlePage = ({
  title,
  content,
  image,
  category,
  author,
  date,
  excerpt,
  permalink,
}) => {
  let [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_700Bold,
    "NotoSerifCondensed-Regular": require("../assets/fonts/static/NotoSerif_Condensed-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const onShare = async () => {
    try {
      const shareMessage = `
Title: ${cleanText(title)}
Author: ${author}
Date: ${formatDate(date)}
${excerpt}

Check out this article! ${permalink}`;

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
    <View style={styles.container}>
      <Image
        source={{
          uri: image && image.trim() !== "" ? image : placeholderImage,
        }}
        style={styles.image}
      />
      <View style={styles.content}>
        {category && <Text style={styles.category}>{cleanText(category)}</Text>}
        {title && <Text style={styles.title}>{cleanText(title)}</Text>}

        {excerpt && (
          <Text style={styles.excerpt}>
            {cleanText(excerpt)}
          </Text>
        )}

        <View style={styles.socialButtons}>
          <View style={styles.authorDate}>
            {author && <Text style={styles.author}>{author}</Text>}
            {date && <Text style={styles.date}>• {formatDate(date)}</Text>}
          </View>
          <TouchableOpacity style={styles.shareButton} onPress={onShare}>
            <Ionicons
              name="share-social-outline"
              size={24}
              color={styles.shareText.color}
            />
          </TouchableOpacity>
        </View>

        {content && (
          <Text style={styles.contentText}>
            {cleanText(content)}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    width: "100%",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  content: {
    paddingVertical: 16,
  },
  category: {
    color: "#FF0000",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Manrope_700Bold',  // Bold font for the title
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0,
  },
  excerpt: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: "NotoSerif-Regular",
    color: "#333",
    marginBottom: 16,
    fontWeight:'semibold'
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "NotoSerif-Regular",
    color: "#333",
    marginBottom: 16,
  },
  authorDate: {
    flexDirection: "row",
  },
  author: {
    fontSize: 14,
    color: "#666",
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  socialButtons: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
    paddingVertical: 12,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
  },
  shareText: {
    marginLeft: 4,
    color: "#1F6CAE",
  },
});

export default ArticlePage;
