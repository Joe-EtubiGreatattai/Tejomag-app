import React, { memo, useMemo, useCallback, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Share,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { cleanText } from "../ult/textCleaner";

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginVertical: 0,
    width: windowWidth,
    alignSelf: "center",
    margin: "auto",
  },
  image: {
    width: "100%",
    height: 219,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
    lineHeight: 32,
    fontFamily: "NotoSerifCondensed-Bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  author: {
    fontSize: 12,
    lineHeight: 16,
    color: "#666",
  },
});

const BreakingNewsCard = memo(
  ({ id, title, author, image, date, permalink, onPress }) => {
    const [fontsLoaded] = useFonts({
      "NotoSerifCondensed-Bold": require("../assets/fonts/static/NotoSerif_Condensed-Bold.ttf"),
    });

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

    const memoizedImage = useMemo(
      () => (
        <Image
          source={image}
          style={styles.image}
          resizeMode="cover"
          fadeDuration={0}
          defaultSource={require("../assets/place-holder.png")}
        />
      ),
      [image]
    );

    const memoizedTitle = useMemo(
      () => <Text style={styles.title}>{cleanText(title)}</Text>,
      [title]
    );

    if (!fontsLoaded) {
      return null;
    }

    return (
      <TouchableOpacity style={styles.card} onPress={onPress}>
        {memoizedImage}
        {memoizedTitle}
        <View style={styles.footer}>
          <Text style={styles.author}>{`${cleanText(author)} • ${date}`}</Text>
          <TouchableOpacity onPress={onShare}>
            <Ionicons name="share-social" size={20} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }
);

export default BreakingNewsCard;
