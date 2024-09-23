import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import TopBar from "./../components/TopTabBar";
import Content from "../components/Content";
import BottomTab from "./../components/BottomTab";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomLoader from '../components/CustomLoader';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home({ route }) {
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("últimas");
  const [userName, setUserName] = useState(""); // State for user's name
  const navigation = useNavigation();

  const fetchUserInfo = useCallback(async () => {
    try {
      const userInfo = await AsyncStorage.getItem("userInfo");
      if (userInfo) {
        const user = JSON.parse(userInfo);
        setUserName(user.name); // Set the user's name
      } else {
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }, []);

  useEffect(() => {
    fetchUserInfo(); // Fetch user info when the component mounts
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

    <SafeAreaView style={styles.container}>
      <TopBar onCategoryChange={handleCategoryChange} />
      {loading ? (
         <CustomLoader text="" />
      ) : (
        <Content category={category} onPress={handleNewsCardPress} />
      )}
      <BottomTab activePage="Home" />
    </SafeAreaView>
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
