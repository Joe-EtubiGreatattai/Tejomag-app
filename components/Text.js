import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const NewsArticle = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.content}>
          Scientists at the University of Copenhagen research institute have
          developed an Artificial Intelligence (AI) algorithm that can help
          communicate with animals in the future. Currently, AI algorithms are
          being used on pigs to decode their emotions and researchers claim that
          they have achieved 60% of success in translating positive & negative
          emotions hidden in pig grunts.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginVertical: 10,
  },
});

export default NewsArticle;