import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from "./../components/Topbar";
import SearchComponent from "../components/SearchInputand";
import NewsArticleCardFour from "../components/NewsCardFour";
import BottomTab from "./../components/BottomTab";
import { useNavigation } from "@react-navigation/native";
import translateText from "../ult/TranslationService";
import CustomLoader from '../components/CustomLoader';

const BASE_API_URL = "https://tejomag.com/wp-json/tejo-mag/v1/posts";

export default function Search() {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [translatedTexts, setTranslatedTexts] = useState({});
  const navigation = useNavigation();

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `${BASE_API_URL}?limit=${searchQuery ? 1150 : 10}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : "&category="}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      const processedData = data.map((item) => ({
        id: item.post.ID,
        image: { uri: item.thumbnail || "https://placehold.co/600x400" }, // Add placeholder if no image
        title: item.post.title,
        author: item.post.author,
        date: item.post.date,
        subtitle: item.post.excerpt,
        permalink: item.post.permalink,
      }));
      setNewsData(processedData);
    } catch (error) {
      console.error("Error fetching news:", error);
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  useEffect(() => {
    const translateContent = async () => {
      const textsToTranslate = [
        "No result found",
        "Error",
      ];

      const translations = {};
      for (let text of textsToTranslate) {
        translations[text] = await translateText(text);
      }
      setTranslatedTexts(translations);
    };

    translateContent();
  }, []);

  const handleSearch = (query) => setSearchQuery(query);

  const handleNewsCardPress = (newsId) =>
    navigation.navigate("Article", { id: newsId });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNews();
  }, [fetchNews]);

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.loaderContainer}>
          <CustomLoader text="" />
        </View>
        <BottomTab activePage="Search" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{`${translatedTexts["Error"] || "Error"}: ${error}`}</Text>
        </View>
        <BottomTab activePage="Search" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <SearchComponent onSearch={handleSearch} hidePopularSearches={!!searchQuery} />
        {newsData.length === 0 ? (
          <CustomLoader text={translatedTexts["No result found"] || "No result found"} />
        ) : (
          newsData.map((news) => (
            <NewsArticleCardFour
              key={news.id}
              logoSource={news.image}
              title={news.title}
              date={news.date}
              onPress={() => handleNewsCardPress(news.id)}
            />
          ))
        )}
      </ScrollView>
      <BottomTab activePage="Search" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "column",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
    width: Dimensions.get("window").width,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    margin: 20,
  },
});
