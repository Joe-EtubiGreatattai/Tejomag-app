import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import TopBar from "./Topbar";
import Content from "./Content";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CategoriesPage({ route }) {
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(route.params?.selectedCategory || "ciencia");
  const [userName, setUserName] = useState("");
  const navigation = useNavigation();

  const fetchUserInfo = useCallback(async () => {
    try {
      const userInfo = await AsyncStorage.getItem("userInfo");
      if (userInfo) {
        const user = JSON.parse(userInfo);
        setUserName(user.name); // Set the user's name
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }, []);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  const loadData = useCallback(async (selectedCategory = category) => {
    setLoading(true);
    try {
      // Simulate data fetching
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setCategory(selectedCategory);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCategoryChange = useCallback((newCategory) => {
    setLoading(true);
    loadData(newCategory);
  }, [loadData]);

  const handleNewsCardPress = useCallback((newsId) => {
    navigation.navigate("Article", { id: newsId });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <TopBar onCategoryChange={handleCategoryChange} />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1F6CAE" />
          <Text style={styles.loadingText}>
            Loading stories, please wait...
          </Text>
        </View>
      ) : (
        <Content category={category} onPress={handleNewsCardPress} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    width: Dimensions.get("window").width,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
});
