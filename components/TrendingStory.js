import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const RelatedStories = () => {
  const navigation = useNavigation();

  const story = {
    id: "1",
    title: "U.S. Investigates Work at Saipan Casino Project With Trump Tie",
    date: "March 9, 2022",
    image: "https://picsum.photos/60/60?random=8", // Replace with your image URL
  };

  const handlePress = (story) => {
    // Navigate to the article page with the story id
    navigation.navigate("Article", { storyId: story.id });
  };

  return (
    <View style={styles.container}>
      <View style={styles.borderedContainer}>
        <Text style={styles.category}>TRENDING STORY</Text>
        <TouchableOpacity onPress={() => handlePress(story)} style={styles.storyItem}>
          <Image source={{ uri: story.image }} style={styles.storyImage} />
          <View style={styles.storyTextContainer}>
            <Text style={styles.storyTitle}>{story.title}</Text>
            <Text style={styles.storyDate}>{story.date}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "100%",
  },
  borderedContainer: {
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#E0E0E0",
    paddingVertical: 8,
  },
  category: {
    color: "#963F6E",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 8,
    paddingHorizontal: 16,
  },
  storyItem: {
    flexDirection: "row",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  storyImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    resizeMode: "contain",
  },
  storyTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  storyDate: {
    fontSize: 12,
    color: "#666",
  },
});

export default RelatedStories;
