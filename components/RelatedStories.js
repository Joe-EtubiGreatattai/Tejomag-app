import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import NewsHeader from "./NewsCardFour"; // Adjust the import path as needed

const RelatedStories = ({ relatedPosts = [] }) => {
  const navigation = useNavigation();

  const handleNewsCardPress = (newsId) => {
    navigation.navigate("Article", { id: newsId });
  };

  if (!relatedPosts.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Related Stories</Text>
        <Text style={styles.noPosts}>No related stories available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Related Stories</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {relatedPosts.map((post) => {
          const title = post.post?.title || "No Title Available";
          const date = post.post?.date || "No Date Available";
          const id = post.post?.ID;

          return (
            <TouchableOpacity
              key={id.toString()} // Ensure this ID is unique and converted to string
             
            >
              <NewsHeader
                logoSource={{ uri: post.thumbnail }} // Use thumbnail as the logo
                title={title}
                date={date}
                onPress={() => handleNewsCardPress(id)}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  scrollView: {
    paddingHorizontal: 10,
  },
  noPosts: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    paddingHorizontal: 10,
  },
});

export default RelatedStories;