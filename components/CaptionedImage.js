import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const CaptionedImage = ({ source , permalink, author}) => {
  return (
    <View style={styles.container}>
      <Image
        source={source}
        style={styles.image}
      />
      <View style={styles.captionContainer}>
        <Text style={styles.caption}>
        {permalink}
        </Text>
        <Text style={styles.credit}>Credit: {author}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
    marginVertical:10
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  captionContainer: {
    padding: 12,
    backgroundColor: "#f0f0f0",
  },
  caption: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  credit: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
});

export default CaptionedImage;
