import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Animated } from "react-native";
import { useFonts } from "expo-font";

const images = [
  { uri: "https://picsum.photos/400/200?random=1" },
  { uri: "https://picsum.photos/400/200?random=2" },
  { uri: "https://picsum.photos/400/200?random=3" },
];

const titles = [
  "Pigs through history",
  "The evolution of swine",
  "Porky tales from the past",
];

const SlideShowCard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = new Animated.Value(1);

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const [fontsLoaded] = useFonts({
    "NotoSerifCondensed-Bold": require("../assets/fonts/static/NotoSerif_Condensed-ExtraBold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
      <Image source={images[currentIndex]} style={styles.image} />
      <View style={styles.overlay}>
        <View style={styles.textContainer}>
          <Text style={styles.slideshow}>SLIDESHOW</Text>
          <Text
            style={[styles.title, { fontFamily: "NotoSerifCondensed-Bold" }]}
          >
            {titles[currentIndex]}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: 232,
    borderRadius: 10,
    overflow: "hidden",
    margin: 16,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "flex-end",
  },
  textContainer: {
    padding: 16,
  },
  slideshow: {
    color: "white",
    backgroundColor: "#8E44AD",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
  },
  title: {
    color: "white",
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "bold",
  },
});

export default SlideShowCard;
